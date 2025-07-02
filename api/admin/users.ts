
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { protect, admin } from '../_lib/auth';
import dbConnect from '../_lib/db';
import User from '../_lib/models/User';
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

// Updated robust wrapper for the API endpoint
export default function (req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, async () => {
        try {
            await new Promise<void>((resolve, reject) => {
                protect(req as AuthRequest, res, () => resolve()).catch(reject);
            });
            if (res.headersSent) return;

            await new Promise<void>((resolve) => {
                admin(req as AuthRequest, res, () => resolve());
            });
            if (res.headersSent) return;
            
            await apiHandler(req as AuthRequest, res);
        } catch (error: any) {
            console.error(`API Error in ${req.url}:`, error);
            if (!res.headersSent) {
                res.status(500).json({ message: "A server error occurred.", error: error.message });
            }
        }
    });
}
