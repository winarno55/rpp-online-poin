import type { VercelRequest, VercelResponse } from '@vercel/node';
import { protect, admin } from './_lib/auth.js';
import dbConnect from './_lib/db.js';
import PricingConfig from './_lib/models/PricingConfig.js';
import cors from 'cors';

const corsHandler = cors();

type AuthRequest = VercelRequest & {
  user?: any;
};

// --- Logic for getting pricing config ---
async function handleGetConfig(req: VercelRequest, res: VercelResponse) {
    try {
        await dbConnect();
        let config = await PricingConfig.findOne().exec();
        
        if (!config) {
            // Create a default config if none exists
            config = await PricingConfig.create({ 
                pointPackages: [],
                paymentMethods: [],
                sessionCosts: [
                    { sessions: 1, cost: 20 },
                    { sessions: 2, cost: 40 },
                    { sessions: 3, cost: 60 },
                    { sessions: 4, cost: 80 },
                    { sessions: 5, cost: 100 },
                ]
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
}

// --- Logic for updating pricing config (admin only) ---
async function handleUpdateConfig(req: AuthRequest, res: VercelResponse) {
    try {
        // Middleware-style protection for admin
        let authorized = false;
        await new Promise<void>((resolve) => {
            protect(req, res, () => {
                admin(req, res, () => {
                    authorized = true;
                    resolve();
                });
            });
        });

        if (!authorized) {
            // Response has already been sent by protect/admin middleware
            return;
        }

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
export default async function handler(req: VercelRequest, res: VercelResponse) {
    await new Promise((resolve) => corsHandler(req, res, resolve));
    
    if (req.method === 'GET') {
        await handleGetConfig(req, res);
        return;
    }
    if (req.method === 'POST') {
        await handleUpdateConfig(req as AuthRequest, res);
        return;
    }
    
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed on /api/pricing` });
}