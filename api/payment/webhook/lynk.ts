


import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../../_lib/db.js';
import User from '../../_lib/models/User.js';
import Transaction from '../../_lib/models/Transaction.js';
import mongoose from 'mongoose';
import cors from 'cors';
import crypto from 'crypto';

const corsHandler = cors();

// This endpoint is now a PUBLIC webhook receiver for Lynk.id/Payme.id
// It should NOT have the 'protect' middleware.
export default function handler(req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, async () => {
        if (req.method !== 'POST') {
            res.setHeader('Allow', ['POST']);
            return res.status(405).json({ message: 'Method Not Allowed' });
        }

        const LYNK_MERCHANT_KEY = process.env.LYNK_MERCHANT_KEY;
        if (!LYNK_MERCHANT_KEY) {
            console.error('CRITICAL: LYNK_MERCHANT_KEY is not set for webhook validation.');
            return res.status(500).json({ message: 'Server configuration error.' });
        }

        const signature = req.headers['x-lynk-signature'] as string;
        if (!signature) {
            console.warn('Webhook received without X-Lynk-Signature header.');
            return res.status(401).json({ message: 'Signature missing.' });
        }
        
        // As per Lynk.id docs, extract fields to validate signature.
        // Field names are based on common webhook patterns for Payme.id.
        const { reference_id, grand_total, id: message_id, status } = req.body;

        try {
            // Note: The Lynk.id documentation is sparse on the exact signature generation method.
            // This implementation assumes a common pattern: SHA256 hash of concatenated values with the merchant key.
            // If this fails, the exact string-to-sign format needs to be confirmed with Lynk.id support.
            const expectedSignature = crypto
                .createHash('sha256')
                .update(reference_id + grand_total + message_id + LYNK_MERCHANT_KEY)
                .digest('hex');
            
            if (signature !== expectedSignature) {
                console.warn(`Webhook signature mismatch. Got: ${signature}, Expected: ${expectedSignature}`);
                return res.status(401).json({ message: 'Invalid signature.' });
            }

            // Signature is valid, proceed with business logic.
            // We only care about successfully paid transactions.
            if (status !== 'PAID') {
                console.log(`Webhook received for non-paid status: ${status} for ref: ${reference_id}. Acknowledging without action.`);
                return res.status(200).json({ message: 'Webhook acknowledged. No action taken for non-paid status.' });
            }

            await dbConnect();
            const session = await mongoose.startSession();
            
            try {
                await session.withTransaction(async () => {
                    const transaction = await Transaction.findById(reference_id).session(session);
                    if (!transaction) {
                        // This can happen if the transaction is somehow deleted, or if the webhook is for a non-existent one.
                        console.error(`Webhook for non-existent transaction ID: ${reference_id}`);
                        // Still return 200 OK to prevent Lynk.id from resending.
                        return;
                    }

                    // Idempotency check: Only process if the transaction is still pending.
                    if (transaction.status === 'PENDING') {
                        const user = await User.findById(transaction.userId).session(session);
                        if (!user) {
                            console.error(`User with ID ${transaction.userId} not found for transaction ${reference_id}.`);
                            return;
                        }

                        user.points += transaction.points;
                        transaction.status = 'COMPLETED';
                        
                        await user.save({ session });
                        await transaction.save({ session });
                        console.log(`Successfully processed webhook for transaction ${reference_id}. Awarded ${transaction.points} points to user ${user.email}.`);
                    } else {
                        console.log(`Webhook for already processed transaction ${reference_id} received. Current status: ${transaction.status}. Ignoring.`);
                    }
                });
            } catch (dbError: any) {
                console.error('Database transaction failed during webhook processing:', dbError);
                // Return 500 so Lynk.id might retry.
                return res.status(500).json({ message: 'Error processing transaction.', error: dbError.message });
            } finally {
                session.endSession();
            }

            // Acknowledge the webhook successfully.
            res.status(200).json({ message: 'Webhook processed successfully.' });

        } catch (error: any) {
            console.error('General webhook processing error:', error);
            res.status(500).json({ message: 'Internal server error.', error: error.message });
        }
    });
}
