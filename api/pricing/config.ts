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
      
      // We assume there is only one pricing configuration document
      const config = await PricingConfig.findOne().exec();
      
      if (!config) {
        // Return a default empty state if no config has been set by the admin yet
        return res.status(200).json({ 
            pointPackages: [],
            paymentMethods: []
        });
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
