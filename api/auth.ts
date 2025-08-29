import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import dbConnect from './_lib/db.js';
import User from './_lib/models/User.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { createApiHandler } from './_lib/handler.js';

// --- Logic from login.ts ---
async function handleLogin(req: VercelRequest, res: VercelResponse) {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        throw new Error('Internal server configuration error: JWT_SECRET is not defined.');
    }
    
    const { email, password } = req.body;
    const lowercasedEmail = email.toLowerCase();

    if (lowercasedEmail === 'admin' && password === 'besamld55') {
        const adminUser = { id: 'admin_user_id', email: 'admin', points: 99999, role: 'admin' as const };
        const token = jwt.sign({ id: adminUser.id, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
        // FIX: The handler wrapper expects Promise<void>, so don't return the response object.
        res.status(200).json({ token, user: adminUser });
        return;
    }

    await dbConnect();
    if (!email || !password) {
        res.status(400).json({ message: 'Harap berikan email dan password' });
        return;
    }
    
    const user = await User.findOne({ email: lowercasedEmail }).select('+password').exec();
    if (!user || !(await user.comparePassword(password))) {
        res.status(401).json({ message: 'Kredensial tidak valid' });
        return;
    }
    
    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: '30d' });
    res.status(200).json({
        token,
        user: { id: user._id.toString(), email: user.email, points: user.points, role: user.role },
    });
}

// --- Logic from register.ts ---
async function handleRegister(req: VercelRequest, res: VercelResponse) {
    await dbConnect();
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'Harap berikan email dan password' });
        return;
    }

    const lowercasedEmail = email.toLowerCase();
    const userExists = await User.findOne({ email: lowercasedEmail }).exec();
    if (userExists) {
        res.status(400).json({ message: 'Pengguna dengan email ini sudah ada' });
        return;
    }
    
    await User.create({ email: lowercasedEmail, password });
    res.status(201).json({ success: true, message: 'Pengguna berhasil dibuat' });
}

// --- Logic from forgot-password.ts ---
async function sendEmail(options: { email: string; subject: string; message: string; }) {
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SMTP_FROM_EMAIL || !process.env.SMTP_FROM_NAME) {
        console.error("One or more SMTP environment variables are not set.");
        throw new Error("Server tidak dikonfigurasi untuk mengirim email. Silakan hubungi dukungan.");
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
    await dbConnect();
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ message: 'Alamat email diperlukan.'});
        return;
    }
    const lowercasedEmail = email.toLowerCase();
    const user = await User.findOne({ email: lowercasedEmail });

    if (!user) {
        console.log(`Password reset requested for non-existent user: ${email}`);
        // Kirim respons sukses generik untuk mencegah enumerasi email
        res.status(200).json({ success: true, message: 'Jika email Anda terdaftar, Anda akan menerima tautan reset password.' });
        return;
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    if (!host) throw new Error("Host header tidak ada dalam request.");
    
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
}

// --- Logic from reset-password.ts ---
async function handleResetPassword(req: VercelRequest, res: VercelResponse) {
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
        res.status(400).json({ message: 'Token tidak valid atau sudah kedaluwarsa.' });
        return;
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password berhasil direset! Anda akan diarahkan ke halaman login.',
    });
}

// --- Main Handler ---
const apiHandler = async (req: VercelRequest, res: VercelResponse) => {
    const { action } = req.query;

    if (req.method === 'POST') {
        switch (action) {
            case 'login':
                return await handleLogin(req, res);
            case 'register':
                return await handleRegister(req, res);
            case 'forgot-password':
                return await handleForgotPassword(req, res);
            default:
                break;
        }
    }
    
    if (req.method === 'PUT' && action === 'reset-password') {
        return await handleResetPassword(req, res);
    }

    res.setHeader('Allow', ['POST', 'PUT']);
    res.status(404).json({ message: `Tindakan otentikasi '${action}' tidak ditemukan untuk metode ${req.method}` });
};

export default createApiHandler(apiHandler);