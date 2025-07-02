

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { protect, admin } from '../_lib/auth.js';
import dbConnect from '../_lib/db.js';
import User from '../_lib/models/User.js';
import cors from 'cors';

const corsHandler = cors();

interface AuthRequest extends VercelRequest {
  user?: any;
}

async function apiHandler(req: AuthRequest, res: VercelResponse) {
  try {
    await dbConnect();
    
    const users = await User.find({ role: { $ne: 'admin' } }).select('_id email points createdAt').sort({ createdAt: -1 });
    
    res.status(200).json(users);

  } catch (error: any) {
    console.error('Server error while fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users.', error: error.message });
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