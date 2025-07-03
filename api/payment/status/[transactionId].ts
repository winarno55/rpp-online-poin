
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { protect } from '../../_lib/auth.js';
import dbConnect from '../../_lib/db.js';
import Transaction from '../../_lib/models/Transaction.js';
import { IUser } from '../../_lib/models/User.js';
import cors from 'cors';

const corsHandler = cors();

type AuthRequest = VercelRequest & {
  user?: IUser;
};

// This is a protected endpoint for the client to poll the status of a transaction
async function apiHandler(req: AuthRequest, res: VercelResponse) {
    try {
        await dbConnect();
        
        const { transactionId } = req.query;
        if (!transactionId || typeof transactionId !== 'string') {
            return res.status(400).json({ message: 'Transaction ID is missing or invalid.' });
        }

        const transaction = await Transaction.findById(transactionId).exec();

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }

        // Security Check: Ensure the logged-in user owns this transaction
        if (transaction.userId.toString() !== req.user!._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this transaction.' });
        }
        
        // Return only the status to the client
        return res.status(200).json({ status: transaction.status });

    } catch (error: any) {
        console.error('Error fetching transaction status:', error);
        res.status(500).json({ message: 'Server error while fetching status.', error: error.message });
    }
}

// Wrapper to apply the 'protect' middleware
async function protectedApiRoute(req: AuthRequest, res: VercelResponse) {
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    await protect(req, res, next);
    if (res.headersSent) return;
    if (!nextCalled) throw new Error("Middleware 'protect' failed to call next or send response.");

    await apiHandler(req, res);
}

// Main export for the Vercel serverless function
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
