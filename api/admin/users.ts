import type { VercelRequest, VercelResponse } from '@vercel/node';
import { protect, admin } from '../_lib/auth.js';
import dbConnect from '../_lib/db.js';
import User from '../_lib/models/User.js';
import cors from 'cors';

const corsHandler = cors();

interface AuthRequest extends VercelRequest {
  user?: any; // Allow the mock admin user
}

async function apiHandler(req: AuthRequest, res: VercelResponse) {
  try {
    await dbConnect();
    
    // Fetch all users that do not have the 'admin' role
    // Sort by most recently created
    const users = await User.find({ role: { $ne: 'admin' } }).select('_id email points createdAt').sort({ createdAt: -1 });
    
    res.status(200).json(users);

  } catch (error: any) {
    console.error('Server error while fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users.', error: error.message });
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
