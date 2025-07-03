

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { protect } from '../../_lib/auth.js';
import dbConnect from '../../_lib/db.js';
import User, { IUser } from '../../_lib/models/User.js';
import Transaction from '../../_lib/models/Transaction.js';
import mongoose from 'mongoose';
import cors from 'cors';

const corsHandler = cors();

type AuthRequest = VercelRequest & {
  user?: IUser;
};

// This endpoint is NOT a webhook receiver. It's a client-driven payment verifier.
async function apiHandler(req: AuthRequest, res: VercelResponse) {
    const LYNK_MERCHANT_KEY = process.env.LYNK_MERCHANT_KEY;
    if (!LYNK_MERCHANT_KEY) {
        return res.status(500).json({ message: 'Konfigurasi pembayaran di sisi server belum lengkap.' });
    }

    await dbConnect();

    const { transactionId } = req.body; // This is our internal ID, used as reference_id
    if (!transactionId || !mongoose.Types.ObjectId.isValid(transactionId)) {
        return res.status(400).json({ message: 'Valid Transaction ID is required.' });
    }

    const session = await mongoose.startSession();
    try {
        let finalMessage = 'Payment confirmation failed.';
        let newPoints = req.user!.points || 0;
        let confirmationStatus: 'success' | 'failed' | 'pending' = 'failed';

        // Securely verify the transaction status with the Payme.id API
        const verifyResponse = await fetch(`https://api.payme.id/v2/transactions/${transactionId}`, {
            method: 'GET',
            headers: { 'X-API-KEY': LYNK_MERCHANT_KEY }
        });

        const paymeData = await verifyResponse.json();

        if (!verifyResponse.ok) {
            throw new Error(`Failed to verify payment with provider: ${paymeData.message || 'Unknown error'}`);
        }

        const isPaid = paymeData.status === 'PAID';

        if (isPaid) {
            // Use a database transaction to ensure atomicity
            await session.withTransaction(async () => {
                const transaction = await Transaction.findById(transactionId).session(session);

                if (!transaction) { throw new Error('Transaction not found in our database.'); }
                if (transaction.userId.toString() !== req.user!._id.toString()) { throw new Error('You are not authorized to confirm this transaction.'); }

                // Only award points if the transaction is still PENDING to prevent double-crediting
                if (transaction.status === 'PENDING') {
                    const user = await User.findById(req.user!._id).session(session);
                    if (!user) { throw new Error('Associated user account not found.'); }
                    
                    user.points += transaction.points;
                    transaction.status = 'COMPLETED';
                    
                    await user.save({ session });
                    await transaction.save({ session });
                    
                    newPoints = user.points;
                    finalMessage = `Successfully added ${transaction.points} points. Your payment is confirmed!`;
                } else {
                    finalMessage = 'Payment was already confirmed.';
                    const user = await User.findById(req.user!._id).session(session);
                    newPoints = user?.points || newPoints; // Ensure points are up-to-date
                }
            });
            confirmationStatus = 'success';
        } else {
            // Handle cases where payment is not yet confirmed by the provider
            finalMessage = `Payment status is '${paymeData.status}'. Please try again shortly or contact support if payment has been made.`;
            confirmationStatus = paymeData.status === 'PENDING' ? 'pending' : 'failed';
        }
        
        res.status(200).json({
            success: confirmationStatus === 'success',
            message: finalMessage,
            newPoints: newPoints
        });
    } catch (error: any) {
        console.error('Payment confirmation error:', error);
        res.status(500).json({ message: 'Error confirming payment.', error: error.message });
    } finally {
        session.endSession();
    }
}

async function protectedApiRoute(req: AuthRequest, res: VercelResponse) {
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    await protect(req, res, next);
    if (res.headersSent) return;
    if (!nextCalled) throw new Error("Middleware 'protect' failed to call next or send response.");

    await apiHandler(req, res);
}

export default function(req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, async () => {
        try {
            await protectedApiRoute(req as AuthRequest, res);
        } catch (e: any) {
            console.error("API Route Unhandled Exception:", e.message);
            if (!res.headersSent) {
                res.status(500).json({ message: "An unexpected error occurred in the handler wrapper." });
            }
        }
    });
}