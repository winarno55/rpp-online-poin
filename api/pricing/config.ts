import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../_lib/db.js';
import PricingConfig from '../_lib/models/PricingConfig.js';
import cors from 'cors';

const corsHandler = cors();

export default function handler(req: VercelRequest, res: VercelResponse) {
  corsHandler(req, res, async () => {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
      await dbConnect();
      
      let config = await PricingConfig.findOne().exec();
      
      let configObj: any;
      if (!config) {
        // Provide a default empty state for packages and methods, 
        // and a logical default for session costs to prevent the app from breaking.
        configObj = { 
            pointPackages: [],
            paymentMethods: [],
            bundleCost: 50,
            sessionCosts: [
                { sessions: 1, cost: 20 },
                { sessions: 2, cost: 40 },
                { sessions: 3, cost: 60 },
                { sessions: 4, cost: 80 },
                { sessions: 5, cost: 100 },
            ]
        };
      } else {
        configObj = config.toObject();
      }

      const isSandbox = config ? (config.midtransSandbox ?? true) : true;
      const isProduction = !isSandbox;
      const clientKey = isProduction
        ? (process.env.MIDTRANS_PRODUCTION_CLIENT_KEY || process.env.MIDTRANS_CLIENT_KEY || '')
        : (process.env.MIDTRANS_SANDBOX_CLIENT_KEY || process.env.MIDTRANS_CLIENT_KEY || '');
      const enabled = config ? (config.midtransEnabled ?? false) : false;

      // Append Midtrans public configuration
      configObj.midtrans = {
        clientKey,
        isProduction,
        enabled,
        snapScriptUrl: isProduction
          ? 'https://app.midtrans.com/snap/snap.js'
          : 'https://app.sandbox.midtrans.com/snap/snap.js'
      };

      res.status(200).json(configObj);

    } catch (error: any) {
      console.error("Error fetching pricing config:", error);
      res.status(500).json({
        message: 'Gagal mengambil konfigurasi harga dari server.',
        error: error.message
      });
    }
  });
}