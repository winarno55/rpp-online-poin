import type { VercelRequest, VercelResponse } from '@vercel/node';
import { protect, admin } from './_lib/auth.js';
import dbConnect from './_lib/db.js';
import User, { IUser } from './_lib/models/User.js';
import cors from 'cors';

const corsHandler = cors();

type AuthRequest = VercelRequest & {
  user?: IUser;
};

// --- Logic from users.ts ---
async function handleGetUsers(req: AuthRequest, res: VercelResponse) {
    try {
        await dbConnect();
        const users = await User.find({ role: { $ne: 'admin' } }).select('_id email points createdAt').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error: any) {
        console.error('Server error while fetching users:', error);
        res.status(500).json({ message: 'Server error while fetching users.', error: error.message });
    }
}

// --- Logic from add-points.ts ---
async function handleAddPoints(req: AuthRequest, res: VercelResponse) {
    try {
        await dbConnect();
        const { email, points } = req.body;

        if (!email || !points || isNaN(Number(points)) || Number(points) <= 0) {
            return res.status(400).json({ message: 'Please provide a valid email and a positive number of points.' });
        }

        const targetUser = await User.findOne({ email }).exec();
        if (!targetUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        targetUser.points += Number(points);
        await targetUser.save();

        res.status(200).json({
            message: `Successfully added ${points} points to ${email}. New total: ${targetUser.points}.`
        });
    } catch (error: any) {
        console.error('Server error while adding points:', error);
        res.status(500).json({ message: 'Server error while adding points.', error: error.message });
    }
}

// --- Main Handler ---
async function apiHandler(req: AuthRequest, res: VercelResponse) {
    const { action } = req.query;

    // Middleware check
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

    if (req.method === 'GET' && action === 'users') {
        await handleGetUsers(req, res);
        return;
    }

    if (req.method === 'POST' && action === 'add-points') {
        await handleAddPoints(req, res);
        return;
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(404).json({ message: `Admin action '${action}' not found for method ${req.method}` });
}


export default async function handler(req: VercelRequest, res: VercelResponse) {
    await new Promise((resolve) => corsHandler(req, res, resolve));
    await apiHandler(req as AuthRequest, res);
}