import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from './_lib/handler.js';
import { verifyUser, verifyAdmin, AuthRequest } from './_lib/middleware.js';
import dbConnect from './_lib/db.js';
import PricingConfig from './_lib/models/PricingConfig.js';

// --- Logic for getting pricing config (Public) ---
async function handleGetConfig(req: VercelRequest, res: VercelResponse) {
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
}

// --- Logic for updating pricing config (Admin Only) ---
async function handleUpdateConfig(req: AuthRequest, res: VercelResponse) {
    // Middleware: Verifikasi bahwa pengguna adalah admin.
    const user = await verifyUser(req);
    verifyAdmin(user);

    await dbConnect();
    const { pointPackages, paymentMethods, sessionCosts } = req.body;

    if (!Array.isArray(pointPackages) || !Array.isArray(paymentMethods) || !Array.isArray(sessionCosts)) {
        res.status(400).json({ message: 'Format data tidak valid.' });
        return;
    }

    const updatedConfig = await PricingConfig.findOneAndUpdate(
        {},
        { 
            $set: {
                pointPackages: pointPackages.map(({_id, ...pkg}) => pkg), // Hapus _id jika ada
                paymentMethods: paymentMethods.map(({_id, ...pm}) => pm), // Hapus _id jika ada
                sessionCosts: sessionCosts.map(({_id, ...sc}) => sc) // Hapus _id jika ada
            }
        },
        { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json(updatedConfig);
}

// --- Main Handler ---
const apiHandler = async (req: VercelRequest, res: VercelResponse) => {
    if (req.method === 'GET') {
        return await handleGetConfig(req, res);
    }
    if (req.method === 'POST') {
        return await handleUpdateConfig(req as AuthRequest, res);
    }
    
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ message: `Metode ${req.method} tidak diizinkan untuk /api/pricing` });
};

export default createApiHandler(apiHandler);