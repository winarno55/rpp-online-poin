import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import dbConnect from '../_lib/db.js';
import Transaction from '../_lib/models/Transaction.js';
import User from '../_lib/models/User.js';
import PricingConfig from '../_lib/models/PricingConfig.js';
import ReferralEarning from '../_lib/models/ReferralEarning.js';
import { protect } from '../_lib/auth.js';
import cors from 'cors';

const corsHandler = cors();

type AuthRequest = VercelRequest & {
  user?: any;
};

async function handleCreate(req: VercelRequest, res: VercelResponse) {
  try {
    await dbConnect();

    // 1. Authenticate user
    let authFailed = false;
    await new Promise<void>((innerResolve) => {
      protect(req as any, res, () => {
        innerResolve();
      }).catch((err) => {
        console.error('Auth protect error:', err);
        authFailed = true;
        innerResolve();
      });
    });

    if (res.headersSent || authFailed) {
      return;
    }

    const user = (req as AuthRequest).user;
    if (!user) {
      return res.status(401).json({ message: 'Otorisasi gagal' });
    }

    const { points, price } = req.body;
    if (!points || !price) {
      return res.status(400).json({ message: 'Informasi paket poin tidak lengkap' });
    }

    // 2. Determine environment and credentials
    const config = await PricingConfig.findOne().exec();
    const midtransEnabled = config ? (config.midtransEnabled ?? false) : false;
    if (!midtransEnabled) {
      return res.status(400).json({ message: 'Pembayaran otomatis via Midtrans saat ini sedang dinonaktifkan oleh Admin.' });
    }

    const isSandbox = config ? (config.midtransSandbox ?? true) : true;
    const isProduction = !isSandbox;
    const serverKey = isProduction
      ? (process.env.MIDTRANS_PRODUCTION_SERVER_KEY || process.env.MIDTRANS_SERVER_KEY)
      : (process.env.MIDTRANS_SANDBOX_SERVER_KEY || process.env.MIDTRANS_SERVER_KEY);

    if (!serverKey) {
      return res.status(500).json({ message: 'Konfigurasi pembayaran (Server Key) belum diatur di server.' });
    }
    const midtransUrl = isProduction
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

    // 3. Create a unique Order ID in our system
    const orderId = `TRX-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 4. Save pending transaction in our database
    await Transaction.create({
      userId: user._id,
      orderId,
      points,
      price,
      status: 'pending'
    });

    // 5. Build payload for Midtrans Snap API
    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: price
      },
      customer_details: {
        email: user.email,
      },
      item_details: [
        {
          id: `pkg-${points}`,
          price: price,
          quantity: 1,
          name: `Top Up ${points} Poin - Modul Ajar Cerdas`
        }
      ],
      credit_card: {
        secure: true
      }
    };

    // 6. Base64 encode the Server Key for Basic Authentication
    const authString = Buffer.from(`${serverKey}:`).toString('base64');

    // 7. Request payment snap token from Midtrans
    const midtransRes = await fetch(midtransUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${authString}`
      },
      body: JSON.stringify(payload)
    });

    const midtransData = await midtransRes.json();

    if (!midtransRes.ok) {
      console.error('Midtrans API error response:', midtransData);
      return res.status(500).json({ 
        message: 'Gagal membuat sesi pembayaran dengan Midtrans.',
        error: midtransData 
      });
    }

    // 8. Return the token and redirect URL to the client
    return res.status(200).json({
      success: true,
      token: midtransData.token,
      redirect_url: midtransData.redirect_url,
      orderId
    });

  } catch (error: any) {
    console.error('Payment create handler error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan internal server.', error: error.message });
  }
}

async function handleNotification(req: VercelRequest, res: VercelResponse) {
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
      return res.status(400).json({ message: 'Payload notifikasi tidak lengkap' });
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
      return res.status(500).json({ message: 'Konfigurasi server key tidak ditemukan' });
    }
    const rawSignatureString = `${order_id}${status_code}${gross_amount}${serverKey}`;
    const computedSignature = crypto
      .createHash('sha512')
      .update(rawSignatureString)
      .digest('hex');

    if (computedSignature !== signature_key) {
      console.error('Signature verification failed! Potential malicious attempt.');
      return res.status(401).json({ message: 'Tanda tangan tidak valid' });
    }

    // 2. Find the transaction in our database
    const transaction = await Transaction.findOne({ orderId: order_id });
    if (!transaction) {
      console.warn(`Transaction for order_id ${order_id} not found in database.`);
      return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
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

          // --- Process Affiliate Commission ---
          if (user.referredBy && config && config.referralEnabled !== false) {
            const commissionPercent = config.referralCommissionPercent ?? 15;
            const commissionAmount = Math.round((transaction.price * commissionPercent) / 100);
            
            if (commissionAmount > 0) {
              const referrer = await User.findById(user.referredBy);
              if (referrer) {
                referrer.affiliateBalance = (referrer.affiliateBalance || 0) + commissionAmount;
                referrer.totalEarnedAffiliate = (referrer.totalEarnedAffiliate || 0) + commissionAmount;
                await referrer.save({ validateBeforeSave: false });

                await ReferralEarning.create({
                  referrerId: referrer._id,
                  refereeId: user._id,
                  refereeEmail: user.email,
                  orderId: transaction.orderId,
                  transactionAmount: transaction.price,
                  commissionPercent,
                  commissionAmount,
                });
                console.log(`Affiliate commission credited to ${referrer.email}: Rp ${commissionAmount}`);
              }
            }
          }
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

    return res.status(200).json({ success: true, message: 'Status transaksi berhasil diperbarui' });

  } catch (error: any) {
    console.error('Payment notification handler error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan internal server.', error: error.message });
  }
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { action } = req.query;
    const actionStr = Array.isArray(action) ? action[0] : action;

    switch (actionStr) {
      case 'create':
        return await handleCreate(req, res);
      case 'notification':
        return await handleNotification(req, res);
      default:
        return res.status(404).json({ message: 'Invalid payment endpoint' });
    }
  });
}
