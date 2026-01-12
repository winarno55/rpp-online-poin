
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { protect, admin } from '../_lib/auth.js';
import dbConnect from '../_lib/db.js';
import User, { IUser } from '../_lib/models/User.js';
import cors from 'cors';

const corsHandler = cors();

type AuthRequest = VercelRequest & {
  user?: IUser;
};

async function apiHandler(req: AuthRequest, res: VercelResponse) {
  try {
    await dbConnect();

    const { userId, points } = req.body;

    // Validasi: Points bisa 0, tapi tidak boleh negatif atau undefined
    if (!userId || points === undefined || isNaN(Number(points)) || Number(points) < 0) {
      return res.status(400).json({ message: 'Mohon berikan User ID yang valid dan jumlah poin (angka positif atau 0).' });
    }

    const targetUser = await User.findById(userId).exec();

    if (!targetUser) {
      return res.status(404).json({ message: 'User tidak ditemukan.' });
    }

    // Set poin ke nilai baru (overwrite)
    targetUser.points = Number(points);
    await targetUser.save();

    res.status(200).json({
      message: `Berhasil mengubah poin ${targetUser.email} menjadi ${targetUser.points}.`
    });
  } catch (error: any) {
    console.error('Server error while updating points:', error);
    res.status(500).json({ message: 'Server error while updating points.', error: error.message });
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
