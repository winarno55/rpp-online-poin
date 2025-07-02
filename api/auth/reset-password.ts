import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../_lib/db';
import User from '../_lib/models/User';
import cors from 'cors';
import crypto from 'crypto';

const corsHandler = cors();

export default function handler(req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, async () => {
        if (req.method !== 'PUT') {
            res.setHeader('Allow', ['PUT']);
            return res.status(405).json({ message: 'Method Not Allowed' });
        }
        
        try {
            await dbConnect();
            
            // Get hashed token from URL params
            const resetPasswordToken = crypto
                .createHash('sha256')
                .update(req.query.token as string)
                .digest('hex');

            const user = await User.findOne({
                resetPasswordToken,
                resetPasswordExpire: { $gt: Date.now() },
            }).select('+password');

            if (!user) {
                return res.status(400).json({ message: 'Token tidak valid atau sudah kedaluwarsa.' });
            }

            // Set new password
            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            res.status(200).json({
                success: true,
                message: 'Password berhasil direset! Anda akan diarahkan ke halaman login.',
            });

        } catch (error: any) {
             console.error("Reset Password Error:", error);
             res.status(500).json({ message: 'Gagal mereset password.', error: error.message });
        }
    });
}