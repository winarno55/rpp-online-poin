
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { protect } from '../_lib/auth.js';
import dbConnect from '../_lib/db.js';
import User, { IUser } from '../_lib/models/User.js';
import cors from 'cors';

const corsHandler = cors();

type AuthRequest = VercelRequest & {
  user?: IUser;
};

// This endpoint returns the data for the currently authenticated user.
async function apiHandler(req: AuthRequest, res: VercelResponse) {
    try {
        await dbConnect();
        
        // The user object from the token might be stale. Fetch the latest from the DB.
        const currentUser = await User.findById(req.user!._id);

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Return a clean user object for the frontend.
        res.status(200).json({
            id: currentUser._id.toString(),
            email: currentUser.email,
            points: currentUser.points,
            role: currentUser.role,
        });

    } catch (error: any) {
        console.error('Error fetching current user:', error);
        res.status(500).json({ message: 'Server error while fetching user data.', error: error.message });
    }
}

// Wrapper to apply the 'protect' middleware
async function protectedApiRoute(req: AuthRequest, res: VercelResponse) {
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    await protect(req, res, next);
    if (res.headersSent) return;
    if (!nextCalled) throw new Error("Middleware 'protect' failed to call next or send response.");

    await apiHandler(req, res);
}

// Main export for the Vercel serverless function
export default function(req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, async () => {
        try {
            await protectedApiRoute(req as AuthRequest, res);
        } catch (e: any) {
            console.error("API Route Unhandled Exception:", e.message);
            if (!res.headersSent) {
                res.status(500).json({ message: "An unexpected error occurred in the handler wrapper." });
            }
        }
    });
}
