import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import dbConnect from '../_lib/db.js';
import User, { IUser } from '../_lib/models/User.js';
import cors from 'cors';

const corsHandler = cors();

export default function handler(req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, async () => {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            console.error("JWT_SECRET environment variable is not defined.");
            return res.status(500).json({ message: 'Internal server configuration error.' });
        }
        
        if (req.method !== 'POST') {
            res.setHeader('Allow', ['POST']);
            return res.status(405).json({ message: 'Method Not Allowed' });
        }

        const { email, password } = req.body;

        // Special hardcoded admin login
        if (email === 'admin' && password === 'besamld55') {
            const adminUser = {
                id: 'admin_user_id', // A unique static ID for the admin
                email: 'admin',
                points: 99999, // Effectively infinite points
                role: 'admin' as const,
            };

            const token = jwt.sign({ id: adminUser.id, role: 'admin' }, JWT_SECRET, {
                expiresIn: '1d', // Admin session shorter for security
            });

            return res.status(200).json({
                token,
                user: adminUser,
            });
        }

        // Regular user login
        try {
            await dbConnect();

            if (!email || !password) {
                return res.status(400).json({ message: 'Please provide email and password' });
            }

            const user = await User.findOne({ email }).select('+password').exec() as IUser | null;

            if (!user || !(await user.comparePassword(password))) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            
            const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, {
                expiresIn: '30d',
            });

            res.status(200).json({
                token,
                user: {
                    id: user._id.toString(), // Convert ObjectId to string for the frontend
                    email: user.email,
                    points: user.points,
                    role: user.role,
                },
            });
        } catch (error: any) {
            console.error("Login Error:", error);
            res.status(500).json({ message: 'Terjadi kesalahan pada server saat login.', error: error.message });
        }
    });
}
