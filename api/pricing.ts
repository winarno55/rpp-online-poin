import type { VercelRequest, VercelResponse } from '@vercel/node';
import { protect, admin } from './_lib/auth.js';
import dbConnect from './_lib/db.js';
import PricingConfig from './_lib/models/PricingConfig.js';
import cors from 'cors';

const corsHandler = cors();

type AuthRequest = VercelRequest & {
  user?: any;
};

// --- Logic from pricing/config.ts ---
async function handleGetConfig(req: VercelRequest, res: VercelResponse) {
    try {
        await dbConnect();
        let config = await PricingConfig.findOne().exec();
        
        if (!config) {
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
}

// --- Logic from admin/pricing.ts ---
async function handleUpdateConfig(req: AuthRequest, res: VercelResponse) {
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
            { new: true, upsert: true, runValidators: true }
        );
        res.status(200).json(updatedConfig);
    } catch (error: any) {
        console.error('Server error while updating pricing config:', error);
        res.status(500).json({ message: 'Gagal menyimpan konfigurasi.', error: error.message });
    }
}

// --- Main Handler ---
export default function handler(req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, () => {
        if (req.method === 'GET') {
            return handleGetConfig(req, res);
        }
        if (req.method === 'POST') {
            // Protect and admin-check the POST route
            return protect(req as AuthRequest, res, () => {
                if (res.headersSent) return;
                admin(req as AuthRequest, res, () => {
                    if (res.headersSent) return;
                    handleUpdateConfig(req as AuthRequest, res);
                });
            });
        }
        
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed on /api/pricing` });
    });
}