import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../_lib/db';
import PricingConfig from '../_lib/models/PricingConfig';
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
      
      if (!config) {
        // Provide a default empty state for packages and methods, 
        // and a logical default for session costs to prevent the app from breaking.
        config = { 
            pointPackages: [],
            paymentMethods: [],
            sessionCosts: [
                { sessions: 1, cost: 20 },
                { sessions: 2, cost: 40 },
                { sessions: 3, cost: 60 },
                { sessions: 4, cost: 80 },
                { sessions: 5, cost: 100 },
            ]
        } as any;
      }

      res.status(200).json(config);

    } catch (error: any) {
      console.error("Error fetching pricing config:", error);
      res.status(500).json({
        message: 'Gagal mengambil konfigurasi harga dari server.',
        error: error.message
      });
    }
  });
}