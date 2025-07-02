
import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../_lib/db';
import User from '../_lib/models/User';
import Transaction from '../_lib/models/Transaction';
import mongoose from 'mongoose';
import cors from 'cors';
import crypto from 'crypto';

const corsHandler = cors();

// IMPORTANT: This webhook handler is a hypothetical implementation.
// The security verification (signature checking) and payload structure must be
// adapted to match the official Lynk.id webhook documentation.

/**
 * Verifies the incoming webhook signature.
 * This is a critical security measure to ensure the request is from Lynk.id.
 */
function verifySignature(signature: string | undefined, body: VercelRequest['body'], secret: string): boolean {
    if (!signature) {
        return false;
    }
    const hmac = crypto.createHmac('sha256', secret);
    // IMPORTANT: Webhook signing often uses the raw string body, not the parsed JSON.
    hmac.update(JSON.stringify(body)); 
    const expectedSignature = hmac.digest('hex');

    try {
        const sigBuffer = Buffer.from(signature);
        const expectedSigBuffer = Buffer.from(expectedSignature);
        if (sigBuffer.length !== expectedSigBuffer.length) {
            return false;
        }
        return crypto.timingSafeEqual(sigBuffer, expectedSigBuffer);
    } catch {
        return false;
    }
}


async function apiHandler(req: VercelRequest, res: VercelResponse) {
    await dbConnect();
    
    // 1. Security Verification
    const LYNK_WEBHOOK_SECRET = process.env.LYNK_WEBHOOK_SECRET;
    // NOTE: The header name 'x-lynk-signature' is hypothetical.
    const signature = req.headers['x-lynk-signature'] as string | undefined;
    
    if (LYNK_WEBHOOK_SECRET) {
        if (!verifySignature(signature, req.body, LYNK_WEBHOOK_SECRET)) {
            console.warn("Invalid webhook signature received.");
            return res.status(401).send('Invalid signature. Webhook request rejected.');
        }
    } else {
        console.error("CRITICAL: LYNK_WEBHOOK_SECRET is not set. Skipping webhook signature verification. THIS IS NOT SAFE FOR PRODUCTION.");
    }
    
    // 2. Parse the webhook payload
    // NOTE: Payload structure is hypothetical.
    const { reference_id, status, provider_transaction_id } = req.body;

    if (!reference_id || !mongoose.Types.ObjectId.isValid(reference_id)) {
        return res.status(400).json({ message: 'Invalid or missing reference_id (Transaction ID)' });
    }

    // NOTE: The status value 'COMPLETED' or 'PAID' is hypothetical.
    if (status !== 'COMPLETED' && status !== 'PAID') { 
        console.log(`Webhook for transaction ${reference_id} received with non-completed status: '${status}'. No action taken.`);
        return res.status(200).json({ message: `Webhook received for status: ${status}.` });
    }
    
    const session = await mongoose.startSession();
    
    try {
        // 3. Start Atomic Transaction
        await session.withTransaction(async () => {
            const transaction = await Transaction.findById(reference_id).session(session);

            if (!transaction) {
                throw new Error('Transaction not found.');
            }
            
            // 4. Idempotency Check
            if (transaction.status === 'COMPLETED') {
                console.log(`Transaction ${reference_id} is already completed. Idempotency check passed.`);
                return;
            }

            const user = await User.findById(transaction.userId).session(session);
            if (!user) {
                throw new Error('User associated with the transaction not found.');
            }

            // 5. Update Records
            user.points += transaction.points;
            transaction.status = 'COMPLETED';
            if (provider_transaction_id) {
                transaction.providerTransactionId = provider_transaction_id;
            }

            await user.save({ session });
            await transaction.save({ session });
            
            console.log(`Successfully completed transaction ${reference_id}. Added ${transaction.points} points to user ${user.email}.`);
        });

        res.status(200).json({ success: true, message: 'Webhook processed successfully.' });

    } catch (error: any) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ message: 'Error processing webhook.', error: error.message });
    } finally {
        session.endSession();
    }
}

// Wrap with CORS. This endpoint is public but protected by signature.
export default function (req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, async () => {
        // No protect/admin middleware here.
        await apiHandler(req, res);
    });
}
