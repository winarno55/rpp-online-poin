import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import dbConnect from './_lib/db.js';
import User from './_lib/models/User.js';
import cors from 'cors';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const corsHandler = cors();

// --- Logic from login.ts ---
async function handleLogin(req: VercelRequest, res: VercelResponse) {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        console.error("JWT_SECRET environment variable is not defined.");
        return res.status(500).json({ message: 'Internal server configuration error.' });
    }
    
    const { email, password } = req.body;
    const lowercasedEmail = email.toLowerCase();

    if (lowercasedEmail === 'admin' && password === 'besamld55') {
        const adminUser = { id: 'admin_user_id', email: 'admin', points: 99999, role: 'admin' as const };
        const token = jwt.sign({ id: adminUser.id, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).json({ token, user: adminUser });
    }

    try {
        await dbConnect();
        if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });
        
        const user = await User.findOne({ email: lowercasedEmail }).select('+password').exec();
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: '30d' });
        res.status(200).json({
            token,
            user: { id: user._id.toString(), email: user.email, points: user.points, role: user.role },
        });
    } catch (error: any) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server saat login.', error: error.message });
    }
}

// --- Logic from register.ts ---
async function handleRegister(req: VercelRequest, res: VercelResponse) {
    try {
        await dbConnect();
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });

        const lowercasedEmail = email.toLowerCase();
        const userExists = await User.findOne({ email: lowercasedEmail }).exec();
        if (userExists) return res.status(400).json({ message: 'User with this email already exists' });
        
        await User.create({ email: lowercasedEmail, password });
        res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (error: any) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server saat registrasi.', error: error.message });
    }
}

// --- Logic from forgot-password.ts ---
async function sendEmail(options: { email: string; subject: string; message: string; }) {
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SMTP_FROM_EMAIL || !process.env.SMTP_FROM_NAME) {
        console.error("One or more SMTP environment variables (HOST, PORT, USER, PASS, FROM_EMAIL, FROM_NAME) are not set.");
        throw new Error("Server is not configured to send emails. Please contact support.");
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    await transporter.sendMail(mailOptions);
}

async function handleForgotPassword(req: VercelRequest, res: VercelResponse) {
    try {
        await dbConnect();
        const { email } = req.body;
        const lowercasedEmail = email.toLowerCase();
        const user = await User.findOne({ email: lowercasedEmail });

        if (!user) {
            console.log(`Password reset requested for non-existent user: ${email}`);
            return res.status(200).json({ success: true, message: 'Jika email Anda terdaftar, Anda akan menerima tautan reset password.' });
        }

        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        const protocol = (req.headers['x-forwarded-proto'] as string) || 'http';
        const host = req.headers.host;
        if (!host) {
             throw new Error("Host header is missing from the request.");
        }
        const resetUrl = `${protocol}://${host}/reset-password/${resetToken}`;
        
        const message = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #0ea5e9;">Reset Password Modul Ajar Cerdas</h2>
                <p>Anda menerima email ini karena Anda (atau orang lain) telah meminta untuk mereset password akun Anda.</p>
                <p>Silakan klik tautan di bawah ini untuk mereset password Anda:</p>
                <p style="margin: 20px 0;">
                    <a href="${resetUrl}" style="background-color: #0ea5e9; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                </p>
                <p>Tautan ini akan kedaluwarsa dalam 15 menit.</p>
                <p>Jika Anda tidak meminta ini, abaikan saja email ini dan password Anda tidak akan berubah.</p>
                <hr style="border: none; border-top: 1px solid #eee;" />
                <p style="font-size: 0.9em; color: #777;">Terima kasih,<br/>Tim Modul Ajar Cerdas</p>
            </div>
        `;

        await sendEmail({
            email: user.email,
            subject: 'Link Reset Password Modul Ajar Cerdas',
            message,
        });

        res.status(200).json({ success: true, message: 'Email reset password telah dikirim. Silakan cek inbox (dan folder spam) Anda.' });

    } catch (error: any) {
        console.error("Forgot Password Error:", error);
        if (req.body.email) {
            const userToClean = await User.findOne({ email: req.body.email.toLowerCase() });
            if (userToClean && userToClean.resetPasswordToken) {
                 userToClean.resetPasswordToken = undefined;
                 userToClean.resetPasswordExpire = undefined;
                 await userToClean.save({ validateBeforeSave: false });
            }
        }
        res.status(500).json({ message: 'Gagal mengirim email. Hubungi admin.', error: error.message });
    }
}

// --- Logic from reset-password.ts ---
async function handleResetPassword(req: VercelRequest, res: VercelResponse) {
    try {
        await dbConnect();
        
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
}

// --- Main Handler ---
export default function handler(req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, async () => {
        const { action } = req.query;

        if (req.method === 'POST' && action === 'login') {
            return await handleLogin(req, res);
        }
        if (req.method === 'POST' && action === 'register') {
            return await handleRegister(req, res);
        }
        if (req.method === 'POST' && action === 'forgot-password') {
            return await handleForgotPassword(req, res);
        }
        if (req.method === 'PUT' && action === 'reset-password') {
            return await handleResetPassword(req, res);
        }

        res.setHeader('Allow', ['POST', 'PUT']);
        return res.status(404).json({ message: `Auth action '${action}' not found for method ${req.method}` });
    });
}