import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../_lib/db.js';
import Transaction from '../_lib/models/Transaction.js';
import PricingConfig from '../_lib/models/PricingConfig.js';
import { protect } from '../_lib/auth.js';
import cors from 'cors';

const corsHandler = cors();

type AuthRequest = VercelRequest & {
  user?: any;
};

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
          return resolve();
        }

        const user = (req as AuthRequest).user;
        if (!user) {
          res.status(401).json({ message: 'Otorisasi gagal' });
          return resolve();
        }

        const { points, price } = req.body;
        if (!points || !price) {
          res.status(400).json({ message: 'Informasi paket poin tidak lengkap' });
          return resolve();
        }

        // 2. Determine environment and credentials
        const config = await PricingConfig.findOne().exec();
        const midtransEnabled = config ? (config.midtransEnabled ?? false) : false;
        if (!midtransEnabled) {
          res.status(400).json({ message: 'Pembayaran otomatis via Midtrans saat ini sedang dinonaktifkan oleh Admin.' });
          return resolve();
        }

        const isSandbox = config ? (config.midtransSandbox ?? true) : true;
        const isProduction = !isSandbox;
        const serverKey = isProduction
          ? (process.env.MIDTRANS_PRODUCTION_SERVER_KEY || process.env.MIDTRANS_SERVER_KEY)
          : (process.env.MIDTRANS_SANDBOX_SERVER_KEY || process.env.MIDTRANS_SERVER_KEY);

        if (!serverKey) {
          res.status(500).json({ message: 'Konfigurasi pembayaran (Server Key) belum diatur di server.' });
          return resolve();
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
          res.status(500).json({ 
            message: 'Gagal membuat sesi pembayaran dengan Midtrans.',
            error: midtransData 
          });
          return resolve();
        }

        // 8. Return the token and redirect URL to the client
        res.status(200).json({
          success: true,
          token: midtransData.token,
          redirect_url: midtransData.redirect_url,
          orderId
        });

      } catch (error: any) {
        console.error('Payment create handler error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan internal server.', error: error.message });
      } finally {
        resolve();
      }
    });
  });
}
