

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { protect } from '../_lib/auth';
import dbConnect from '../_lib/db';
import { IUser } from '../_lib/models/User';
import PricingConfig from '../_lib/models/PricingConfig';
import Transaction, { ITransaction } from '../_lib/models/Transaction';
import cors from 'cors';

const corsHandler = cors();

type AuthRequest = VercelRequest & {
  user?: IUser;
};

// IMPORTANT: This file contains a hypothetical implementation for creating a payment
// link with a payment gateway like Lynk.id. The actual API endpoints, request body,
// and response structure must be verified and adjusted against the official Lynk.id API documentation.

async function apiHandler(req: AuthRequest, res: VercelResponse) {
    await dbConnect();

    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    const { packageId } = req.body;
    if (!packageId) {
        return res.status(400).json({ message: 'Package ID is required.' });
    }
    
    const LYNK_MERCHANT_KEY = process.env.LYNK_MERCHANT_KEY;
    if (!LYNK_MERCHANT_KEY) {
        console.error("LYNK_MERCHANT_KEY environment variable is not set.");
        return res.status(500).json({ message: 'Konfigurasi pembayaran di sisi server belum lengkap.' });
    }

    try {
        const pricingConfig = await PricingConfig.findOne().exec();
        if (!pricingConfig) {
            return res.status(500).json({ message: 'Konfigurasi harga tidak ditemukan.' });
        }

        const selectedPackage = pricingConfig.pointPackages.find(p => p._id.toString() === packageId);
        if (!selectedPackage) {
            return res.status(404).json({ message: 'Paket yang dipilih tidak ditemukan.' });
        }
        
        // Add server-side validation for minimum price
        if (selectedPackage.price < 10000) {
            return res.status(400).json({ message: 'Transaksi otomatis tidak dapat diproses untuk nominal di bawah Rp 10.000.' });
        }

        // 1. Create a local transaction record with 'PENDING' status.
        // Add explicit type ITransaction to fix potential type errors
        const transaction: ITransaction = await Transaction.create({
            userId: req.user._id,
            packageId: selectedPackage._id,
            points: selectedPackage.points,
            price: selectedPackage.price,
            status: 'PENDING',
            provider: 'lynk',
        });

        // 2. Prepare the payload for the Lynk.id API.
        const protocol = (req.headers['x-forwarded-proto'] as string) || 'http';
        const host = req.headers.host;
        const redirectUrl = `${protocol}://${host}/app`; // User is sent here after payment.

        const lynkPayload = {
            amount: selectedPackage.price,
            description: `Top-up: ${selectedPackage.points} Poin untuk ModulAjarCerdas`,
            reference_id: transaction._id.toString(), // Use our internal ID for reconciliation.
            customer_name: req.user.email,
            customer_email: req.user.email,
            redirect_url: redirectUrl,
        };
        
        // 3. Call the Lynk.id API to get a payment URL.
        // NOTE: The URL 'https://api.lynk.id/v1/payments' is hypothetical.
        const lynkResponse = await fetch('https://api.lynk.id/v1/payments', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${LYNK_MERCHANT_KEY}`,
            },
            body: JSON.stringify(lynkPayload),
        });

        const lynkData = await lynkResponse.json();

        if (!lynkResponse.ok) {
            transaction.status = 'FAILED';
            await transaction.save();
            console.error('Lynk API Error:', lynkData);
            throw new Error(`Gagal membuat link pembayaran dengan Lynk.id: ${lynkData.message || 'Error tidak diketahui'}`);
        }
        
        // 4. Update local transaction with the provider's ID and return the payment URL.
        // NOTE: The keys 'payment_url' and 'transaction_id' are hypothetical.
        transaction.providerTransactionId = lynkData.transaction_id;
        await transaction.save();

        res.status(200).json({ paymentUrl: lynkData.payment_url });

    } catch (error: any) {
        console.error("Create transaction error:", error);
        res.status(500).json({ message: error.message || 'Server error while creating transaction.' });
    }
}

export default function (req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, async () => {
        try {
            await new Promise<void>((resolve) => {
                protect(req as AuthRequest, res, () => resolve());
            });
            if (res.headersSent) return;

            await apiHandler(req as AuthRequest, res);
        } catch (error: any) {
            console.error(`API Error in ${req.url}:`, error);
            if (!res.headersSent) {
                res.status(500).json({ message: "A server error occurred.", error: error.message });
            }
        }
    });
};
