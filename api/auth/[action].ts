
import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import dbConnect from '../_lib/db.js';
import User, { IUser } from '../_lib/models/User.js';
import cors from 'cors';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const corsHandler = cors();

// --- HELPER FUNCTIONS ---

async function sendEmail(options: { email: string; subject: string; message: string; }) {
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SMTP_FROM_EMAIL || !process.env.SMTP_FROM_NAME) {
        console.error("SMTP env vars missing.");
        throw new Error("Server is not configured to send emails.");
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    await transporter.sendMail(mailOptions);
}

// --- HANDLERS ---

async function handleLogin(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });
    
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) return res.status(500).json({ message: 'Server config error.' });

    const { email, password } = req.body;

    // Hardcoded Admin
    if (email && email.toLowerCase() === 'admin' && password === 'besamld55') {
        const adminUser = { id: 'admin_user_id', email: 'admin', points: 99999, role: 'admin' as const };
        const token = jwt.sign({ id: adminUser.id, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).json({ token, user: adminUser });
    }

    if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });

    await dbConnect();
    const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') }).select('+password').exec() as IUser | null;

    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: '30d' });
    res.status(200).json({
        token,
        user: { id: user._id.toString(), email: user.email, points: user.points, role: user.role },
    });
}

async function handleRegister(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });

    await dbConnect();
    const userExists = await User.findOne({ email: new RegExp(`^${email.toLowerCase()}$`, 'i') }).exec();
    if (userExists) return res.status(400).json({ message: 'User with this email already exists' });

    await User.create({ email: email.toLowerCase(), password });
    res.status(201).json({ success: true, message: 'User created successfully' });
}

async function handleForgotPassword(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

    const { email } = req.body;
    await dbConnect();
    const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });

    if (!user) {
        // Silent fail for security
        return res.status(200).json({ success: true, message: 'Jika email terdaftar, link reset akan dikirim.' });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const protocol = (req.headers['x-forwarded-proto'] as string) || 'http';
    const host = req.headers.host;
    const resetUrl = `${protocol}://${host}/reset-password/${resetToken}`;
    
    const message = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #0ea5e9;">Reset Password</h2>
            <p>Klik tombol di bawah untuk mereset password Anda:</p>
            <p style="margin: 20px 0;"><a href="${resetUrl}" style="background-color: #0ea5e9; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
            <p>Abaikan jika Anda tidak meminta ini.</p>
        </div>
    `;

    try {
        await sendEmail({ email: user.email, subject: 'Link Reset Password', message });
        res.status(200).json({ success: true, message: 'Email reset dikirim.' });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        throw error;
    }
}

async function handleResetPassword(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'PUT') return res.status(405).json({ message: 'Method Not Allowed' });

    const tokenParam = req.query.token as string;
    if (!tokenParam) return res.status(400).json({ message: 'Token missing' });

    const resetPasswordToken = crypto.createHash('sha256').update(tokenParam).digest('hex');

    await dbConnect();
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    }).select('+password');

    if (!user) return res.status(400).json({ message: 'Token tidak valid atau kedaluwarsa.' });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password berhasil direset!' });
}

// --- MAIN DISPATCHER ---

export default function handler(req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, async () => {
        const { action } = req.query;
        const actionStr = Array.isArray(action) ? action[0] : action;

        try {
            switch (actionStr) {
                case 'login': return await handleLogin(req, res);
                case 'register': return await handleRegister(req, res);
                case 'forgot-password': return await handleForgotPassword(req, res);
                case 'reset-password': return await handleResetPassword(req, res);
                default: return res.status(404).json({ message: 'Invalid auth endpoint' });
            }
        } catch (error: any) {
            console.error("Auth API Error:", error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });
}
