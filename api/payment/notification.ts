import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import dbConnect from '../_lib/db.js';
import Transaction from '../_lib/models/Transaction.js';
import User from '../_lib/models/User.js';
import PricingConfig from '../_lib/models/PricingConfig.js';
import cors from 'cors';

const corsHandler = cors();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return new Promise<void>((resolve) => {
    corsHandler(req, res, async () => {
      if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ message: 'Method Not Allowed' });
        return resolve();
      }

      try {
        await dbConnect();

        const {
          order_id,
          status_code,
          gross_amount,
          signature_key,
          transaction_status,
          payment_type,
          fraud_status
        } = req.body;

        if (!order_id || !status_code || !gross_amount || !signature_key) {
          res.status(400).json({ message: 'Payload notifikasi tidak lengkap' });
          return resolve();
        }

        // 1. Verify Midtrans Signature Key
        // signature_key = SHA512(order_id + status_code + gross_amount + ServerKey)
        const config = await PricingConfig.findOne().exec();
        const isSandbox = config ? (config.midtransSandbox ?? true) : true;
        const isProduction = !isSandbox;
        const serverKey = isProduction
          ? (process.env.MIDTRANS_PRODUCTION_SERVER_KEY || process.env.MIDTRANS_SERVER_KEY)
          : (process.env.MIDTRANS_SANDBOX_SERVER_KEY || process.env.MIDTRANS_SERVER_KEY);

        if (!serverKey) {
          console.error('Server Key (Sandbox/Production) is not defined!');
          res.status(500).json({ message: 'Konfigurasi server key tidak ditemukan' });
          return resolve();
        }
        const rawSignatureString = `${order_id}${status_code}${gross_amount}${serverKey}`;
        const computedSignature = crypto
          .createHash('sha512')
          .update(rawSignatureString)
          .digest('hex');

        if (computedSignature !== signature_key) {
          console.error('Signature verification failed! Potential malicious attempt.');
          res.status(401).json({ message: 'Tanda tangan tidak valid' });
          return resolve();
        }

        // 2. Find the transaction in our database
        const transaction = await Transaction.findOne({ orderId: order_id });
        if (!transaction) {
          console.warn(`Transaction for order_id ${order_id} not found in database.`);
          res.status(404).json({ message: 'Transaksi tidak ditemukan' });
          return resolve();
        }

        const previousStatus = transaction.status;

        // 3. Process status update
        let isSettled = false;
        if (
          transaction_status === 'settlement' || 
          (transaction_status === 'capture' && fraud_status === 'accept')
        ) {
          isSettled = true;
        }

        if (isSettled) {
          // If transaction is already marked as settlement, do not credit points again
          if (previousStatus !== 'settlement') {
            const user = await User.findById(transaction.userId).select('+password');
            if (user) {
              const currentPoints = user.points || 0;
              user.points = currentPoints + transaction.points;
              await user.save({ validateBeforeSave: false });
              console.log(`Successfully credited ${transaction.points} points to ${user.email}. New total: ${user.points}`);
            } else {
              console.error(`User for transaction ${transaction._id} not found.`);
            }

            transaction.status = 'settlement';
          }
        } else if (['expire', 'cancel', 'deny'].includes(transaction_status)) {
          transaction.status = transaction_status as any;
        }

        // Update payment type and store raw response for auditing
        transaction.paymentType = payment_type;
        transaction.midtransResponse = req.body;
        await transaction.save();

        res.status(200).json({ success: true, message: 'Status transaksi berhasil diperbarui' });

      } catch (error: any) {
        console.error('Payment notification handler error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan internal server.', error: error.message });
      } finally {
        resolve();
      }
    });
  });
}
