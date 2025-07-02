
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { protect, admin } from '../_lib/auth';
import dbConnect from '../_lib/db';
import User, { IUser } from '../_lib/models/User';
import cors from 'cors';

const corsHandler = cors();

type AuthRequest = VercelRequest & {
  user?: IUser;
};

async function apiHandler(req: AuthRequest, res: VercelResponse) {
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
