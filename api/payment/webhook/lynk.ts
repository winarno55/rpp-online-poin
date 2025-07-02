import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../_lib/db.js';
import User from '../_lib/models/User.js';
import Transaction from '../_lib/models/Transaction.js';
import mongoose from 'mongoose';
import cors from 'cors';

const corsHandler = cors();

// Di produksi, endpoint ini tidak akan dilindungi oleh auth pengguna,
// tetapi oleh verifikasi signature dari penyedia pembayaran.
// Untuk simulasi ini, kita akan menggunakan token JWT pengguna untuk keamanan.
import { protect } from '../_lib/auth.js'; 

type AuthRequest = VercelRequest & {
  user?: any;
};

async function apiHandler(req: AuthRequest, res: VercelResponse) {
    // Dalam produksi, Anda akan memverifikasi signature webhook di sini
    // const signature = req.headers['lynk-signature'];
    // if (!verifySignature(req.body, signature)) {
    //     return res.status(400).send('Invalid signature');
    // }
    
    const { transactionId } = req.body;
    if (!transactionId || !mongoose.Types.ObjectId.isValid(transactionId)) {
        return res.status(400).json({ message: 'Invalid Transaction ID' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const transaction = await Transaction.findById(transactionId).session(session);

        if (!transaction) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Transaction not found.' });
        }
        
        // Pastikan webhook ini dipanggil oleh pengguna yang benar (hanya untuk simulasi)
        if (transaction.userId.toString() !== req.user?._id.toString()) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ message: 'Forbidden: You cannot confirm this transaction.'});
        }

        // Idempotency check: jika transaksi sudah selesai, jangan proses lagi.
        if (transaction.status === 'COMPLETED') {
            await session.commitTransaction();
            session.endSession();
            const finalUser = await User.findById(transaction.userId);
            return res.status(200).json({ message: 'Poin sudah ditambahkan sebelumnya.', newPoints: finalUser?.points });
        }
        
        if (transaction.status !== 'PENDING') {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({ message: `Transaction is not pending, but in ${transaction.status} state.` });
        }


        const user = await User.findById(transaction.userId).session(session);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update status transaksi dan tambahkan poin ke pengguna
        user.points += transaction.points;
        transaction.status = 'COMPLETED';

        await user.save({ session });
        await transaction.save({ session });
        
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: `${transaction.points} poin telah berhasil ditambahkan ke akun Anda.`,
            newPoints: user.points
        });

    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        console.error('Webhook processing error:', error);
        res.status(500).json({ message: 'Server error during webhook processing.', error: error.message });
    }
}

export default function (req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, () => {
        // Melindungi endpoint webhook ini dengan otentikasi pengguna untuk tujuan simulasi
        protect(req as AuthRequest, res, () => {
            if (res.headersSent) return;
            apiHandler(req as AuthRequest, res);
        });
    });
};