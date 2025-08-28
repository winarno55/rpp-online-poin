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

    if (req.method === 'GET' && action === 'users') {
        return await handleGetUsers(req, res);
    }

    if (req.method === 'POST' && action === 'add-points') {
        return await handleAddPoints(req, res);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(404).json({ message: `Admin action '${action}' not found for method ${req.method}` });
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