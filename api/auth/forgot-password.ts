import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../_lib/db.js';
import User from '../_lib/models/User.js';
import cors from 'cors';
import nodemailer from 'nodemailer';

const corsHandler = cors();

async function sendEmail(options: { email: string; subject: string; message: string; }) {
    // Updated check to include new, more explicit environment variables
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SMTP_FROM_EMAIL || !process.env.SMTP_FROM_NAME) {
        console.error("One or more SMTP environment variables (HOST, PORT, USER, PASS, FROM_EMAIL, FROM_NAME) are not set.");
        throw new Error("Server is not configured to send emails. Please contact support.");
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        // Use the new explicit variables for the sender's identity
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    await transporter.sendMail(mailOptions);
}


export default function handler(req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, async () => {
        if (req.method !== 'POST') {
            res.setHeader('Allow', ['POST']);
            return res.status(405).json({ message: 'Method Not Allowed' });
        }

        try {
            await dbConnect();
            const { email } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                // To prevent email enumeration attacks, we can send a success response even if the user doesn't exist.
                // The user won't get an email, but an attacker won't know if the email is registered.
                console.log(`Password reset requested for non-existent user: ${email}`);
                return res.status(200).json({ success: true, message: 'Jika email Anda terdaftar, Anda akan menerima tautan reset password.' });
            }

            const resetToken = user.getResetPasswordToken();
            await user.save({ validateBeforeSave: false });

            // Use request headers to construct the public URL, avoiding Vercel's internal URLs.
            // 'x-forwarded-proto' provides the protocol (http/https).
            // 'host' provides the domain the user is accessing.
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
            // In case of a server-side sending error, we reset the token to allow the user to try again later.
            if (req.body.email) {
                const userToClean = await User.findOne({ email: req.body.email });
                if (userToClean && userToClean.resetPasswordToken) {
                     userToClean.resetPasswordToken = undefined;
                     userToClean.resetPasswordExpire = undefined;
                     await userToClean.save({ validateBeforeSave: false });
                }
            }
            res.status(500).json({ message: 'Gagal mengirim email. Hubungi admin.', error: error.message });
        }
    });
}