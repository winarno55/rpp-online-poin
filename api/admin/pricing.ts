
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

    const updatedConfig = await PricingConfig.findOneAndUpdate(
        {}, 
        { 
            $set: {
                pointPackages: pointPackages.map(({_id, ...pkg}) => pkg), 
                paymentMethods: paymentMethods.map(({_id, ...pm}) => pm),
                sessionCosts: sessionCosts
            }
        },
        { 
            new: true,
            upsert: true,
            runValidators: true
        }
    );

    res.status(200).json(updatedConfig);

  } catch (error: any) {
    console.error('Server error while updating pricing config:', error);
    res.status(500).json({ message: 'Gagal menyimpan konfigurasi.', error: error.message });
  }
}

async function protectedAdminApiRoute(req: AuthRequest, res: VercelResponse) {
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    await protect(req, res, next);
    if (res.headersSent) return;
    if (!nextCalled) throw new Error("Middleware 'protect' failed to call next or send response.");

    nextCalled = false; // Reset for the next middleware
    admin(req, res, next); // 'admin' is synchronous
    if (res.headersSent) return;
    if (!nextCalled) throw new Error("Middleware 'admin' failed to call next or send response.");
    
    await apiHandler(req, res);
}

export default function(req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, async () => {
        try {
            await protectedAdminApiRoute(req as AuthRequest, res);
        } catch (e: any) {
            console.error("API Route Unhandled Exception:", e.message);
            if (!res.headersSent) {
                res.status(500).json({ message: "An unexpected error occurred in the handler wrapper." });
            }
        }
    });
}
