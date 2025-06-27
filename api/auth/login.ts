import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import dbConnect from '../_lib/db';
import User, { IUser } from '../_lib/models/User';
import cors from 'cors';

const corsHandler = cors();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('Please define the JWT_SECRET environment variable');
}

export default function handler(req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, async () => {
        if (req.method !== 'POST') {
            res.setHeader('Allow', ['POST']);
            return res.status(405).json({ message: 'Method Not Allowed' });
        }

        await dbConnect();

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        try {
            const user = await User.findOne<IUser>({ email }).select('+password').exec();

            if (!user || !(await user.comparePassword(password))) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            
            const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, {
                expiresIn: '30d',
            });

            res.status(200).json({
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    points: user.points,
                    role: user.role,
                },
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    });
}