
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

// Correctly handles chained middleware with callbacks.
export default function (req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, () => {
        // Chain middleware: protect -> admin -> apiHandler
        protect(req as AuthRequest, res, () => {
            if (res.headersSent) {
                return;
            }
            admin(req as AuthRequest, res, () => {
                if (res.headersSent) {
                    return;
                }
                apiHandler(req as AuthRequest, res);
            });
        });
    });
}
