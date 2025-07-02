
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { protect, admin } from '../_lib/auth';
import dbConnect from '../_lib/db';
import PricingConfig from '../_lib/models/PricingConfig';
import cors from 'cors';

const corsHandler = cors();

type AuthRequest = VercelRequest & {
  user?: any;
};

async function apiHandler(req: AuthRequest, res: VercelResponse) {
  try {
    await dbConnect();

    const { pointPackages, paymentMethods, sessionCosts } = req.body;

    if (!Array.isArray(pointPackages) || !Array.isArray(paymentMethods) || !Array.isArray(sessionCosts)) {
        return res.status(400).json({ message: 'Invalid data format.' });
    }

    // Use findOneAndUpdate with upsert: true. This will create the document if it doesn't exist,
    // or update it if it does. This is perfect for a singleton configuration model.
    const updatedConfig = await PricingConfig.findOneAndUpdate(
        {}, // An empty filter will match the first document found
        { 
            $set: {
                pointPackages: pointPackages.map(({_id, ...pkg}) => pkg), // remove any frontend _id
                paymentMethods: paymentMethods.map(({_id, ...pm}) => pm), // remove any frontend _id
                sessionCosts: sessionCosts // save the session costs
            }
        },
        { 
            new: true,          // Return the modified document
            upsert: true,       // Create a new document if one doesn't exist
            runValidators: true // Ensure new data conforms to the schema
        }
    );

    res.status(200).json(updatedConfig);

  } catch (error: any) {
    console.error('Server error while updating pricing config:', error);
    res.status(500).json({ message: 'Gagal menyimpan konfigurasi.', error: error.message });
  }
}

// Updated robust wrapper for the API endpoint
export default function (req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, async () => {
        try {
            await new Promise<void>((resolve, reject) => {
                protect(req as AuthRequest, res, () => resolve()).catch(reject);
            });
            if (res.headersSent) return;
            
            await new Promise<void>((resolve) => {
                admin(req as AuthRequest, res, () => resolve());
            });
            if (res.headersSent) return;

            await apiHandler(req as AuthRequest, res);
        } catch (error: any) {
            console.error(`API Error in ${req.url}:`, error);
            if (!res.headersSent) {
                res.status(500).json({ message: "A server error occurred.", error: error.message });
            }
        }
    });
}
