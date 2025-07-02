
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { protect } from '../../_lib/auth';
import dbConnect from '../../_lib/db';
import User, { IUser } from '../../_lib/models/User';
import Transaction from '../../_lib/models/Transaction';
import mongoose from 'mongoose';
import cors from 'cors';

const corsHandler = cors();

type AuthRequest = VercelRequest & {
  user?: IUser;
};

// This endpoint is now repurposed for client-side, post-payment confirmation.
// It is NOT a real webhook handler anymore and is protected by authentication.
async function apiHandler(req: AuthRequest, res: VercelResponse) {
    await dbConnect();

    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    // The client sends transactionId, which corresponds to the transaction's _id
    const { transactionId } = req.body;
    if (!transactionId || !mongoose.Types.ObjectId.isValid(transactionId)) {
        return res.status(400).json({ message: 'Valid Transaction ID is required.' });
    }

    const session = await mongoose.startSession();
    try {
        let newPoints = req.user.points || 0;
        let finalMessage = 'Payment was already confirmed.';

        await session.withTransaction(async () => {
            const transaction = await Transaction.findById(transactionId).session(session);

            if (!transaction) {
                throw new Error('Transaction could not be verified.');
            }

            // Security check: ensure the transaction belongs to the logged-in user
            if (transaction.userId.toString() !== req.user?._id.toString()) {
                console.warn(`Security alert: User ${req.user.email} tried to confirm transaction ${transactionId} belonging to user ${transaction.userId}.`);
                throw new Error('You are not authorized to confirm this transaction.');
            }
            
            // Idempotency check: only process pending transactions
            if (transaction.status === 'PENDING') {
                const user = await User.findById(req.user?._id).session(session);
                if (!user) {
                    throw new Error('Associated user account not found.');
                }
                
                user.points += transaction.points;
                transaction.status = 'COMPLETED';
                
                await user.save({ session });
                await transaction.save({ session });
                
                newPoints = user.points;
                finalMessage = `Successfully added ${transaction.points} points. Your payment is confirmed!`;
            }
        });

        res.status(200).json({
            success: true,
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

// Correctly handles middleware with callbacks.
export default function (req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, () => {
        // Use `protect` middleware, passing the main handler as the 'next' function.
        protect(req as AuthRequest, res, () => {
            // If `protect` already sent a response (e.g., 401 Unauthorized), we must not continue.
            if (res.headersSent) {
                return;
            }
            // `protect` was successful, call the main API logic.
            apiHandler(req as AuthRequest, res);
        });
    });
}
