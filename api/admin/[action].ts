
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { protect, admin } from '../_lib/auth.js';
import dbConnect from '../_lib/db.js';
import User, { IUser } from '../_lib/models/User.js';
import PricingConfig from '../_lib/models/PricingConfig.js';
import cors from 'cors';

const corsHandler = cors();

type AuthRequest = VercelRequest & {
  user?: IUser;
};

// --- HANDLERS ---

async function handleGetUsers(req: AuthRequest, res: VercelResponse) {
    const users = await User.find({ role: { $ne: 'admin' } }).select('_id email points createdAt').sort({ createdAt: -1 });
    res.status(200).json(users);
}

async function handleAddPoints(req: AuthRequest, res: VercelResponse) {
    const { email, points } = req.body;
    if (!email || !points || isNaN(Number(points)) || Number(points) <= 0) {
      return res.status(400).json({ message: 'Invalid data.' });
    }
    const targetUser = await User.findOne({ email }).exec();
    if (!targetUser) return res.status(404).json({ message: 'User not found.' });

    targetUser.points += Number(points);
    await targetUser.save();
    res.status(200).json({ message: `Points added. New total: ${targetUser.points}.` });
}

async function handleUpdatePoints(req: AuthRequest, res: VercelResponse) {
    const { userId, points } = req.body;
    if (!userId || points === undefined || isNaN(Number(points)) || Number(points) < 0) {
      return res.status(400).json({ message: 'Invalid data.' });
    }
    const targetUser = await User.findById(userId).exec();
    if (!targetUser) return res.status(404).json({ message: 'User not found.' });

    targetUser.points = Number(points);
    await targetUser.save();
    res.status(200).json({ message: `Points updated to ${targetUser.points}.` });
}

async function handleUpdatePricing(req: AuthRequest, res: VercelResponse) {
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
}

// --- MAIN DISPATCHER ---

async function apiHandler(req: AuthRequest, res: VercelResponse) {
    const { action } = req.query;
    const actionStr = Array.isArray(action) ? action[0] : action;

    try {
        await dbConnect();
        switch (actionStr) {
            case 'users': return await handleGetUsers(req, res);
            case 'add-points': return await handleAddPoints(req, res);
            case 'update-points': return await handleUpdatePoints(req, res);
            case 'pricing': return await handleUpdatePricing(req, res);
            default: return res.status(404).json({ message: 'Invalid admin endpoint' });
        }
    } catch (error: any) {
        console.error(`Admin API Error (${actionStr}):`, error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export default function (req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, () => {
        protect(req as AuthRequest, res, () => {
            if (res.headersSent) return;
            admin(req as AuthRequest, res, () => {
                if (res.headersSent) return;
                apiHandler(req as AuthRequest, res);
            });
        });
    });
}
