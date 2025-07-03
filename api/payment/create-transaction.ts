

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { protect } from '../_lib/auth.js';
import dbConnect from '../_lib/db.js';
import { IUser } from '../_lib/models/User.js';
import PricingConfig from '../_lib/models/PricingConfig.js';
import Transaction, { ITransaction } from '../_lib/models/Transaction.js';
import cors from 'cors';

const corsHandler = cors();

type AuthRequest = VercelRequest & {
  user?: IUser;
};

async function apiHandler(req: AuthRequest, res: VercelResponse) {
    const LYNK_MERCHANT_KEY = process.env.LYNK_MERCHANT_KEY;
    if (!LYNK_MERCHANT_KEY) {
        console.error("LYNK_MERCHANT_KEY environment variable is not set.");
        return res.status(500).json({ message: 'Konfigurasi pembayaran di sisi server belum lengkap.' });
    }
    
    try {
        await dbConnect();

        const { packageId } = req.body;
        if (!packageId) {
            return res.status(400).json({ message: 'Package ID is required.' });
        }
    
        const pricingConfig = await PricingConfig.findOne().exec();
        if (!pricingConfig) {
            return res.status(500).json({ message: 'Konfigurasi harga tidak ditemukan.' });
        }

        const selectedPackage = pricingConfig.pointPackages.find(p => p._id.toString() === packageId);
        if (!selectedPackage) {
            return res.status(404).json({ message: 'Paket yang dipilih tidak ditemukan.' });
        }
        
        if (selectedPackage.price < 10000) {
            return res.status(400).json({ message: 'Transaksi otomatis tidak dapat diproses untuk nominal di bawah Rp 10.000.' });
        }

        const transaction: ITransaction = await Transaction.create({
            userId: req.user!._id,
            packageId: selectedPackage._id,
            points: selectedPackage.points,
            price: selectedPackage.price,
            status: 'PENDING',
            provider: 'lynk', // Keep provider name simple for consistency
        });

        const protocol = (req.headers['x-forwarded-proto'] as string) || 'http';
        const host = req.headers.host;
        const redirectUrl = `${protocol}://${host}/app/payment-status?transaction_id=${transaction._id.toString()}`;

        // Calculate expiration time (1 hour from now) as a Unix timestamp for Payme.id
        const expired_at = Math.floor(Date.now() / 1000) + 3600;

        // Correct payload for Payme.id API v2
        const paymePayload = {
            reference_id: transaction._id.toString(),
            amount: selectedPackage.price,
            note: `Top-up: ${selectedPackage.points} Poin untuk ModulAjarCerdas`,
            customer_name: req.user!.email,
            customer_email: req.user!.email,
            redirect_url: redirectUrl,
            expired_at: expired_at,
        };
        
        // Correct endpoint and headers for Payme.id API v2
        const paymeResponse = await fetch('https://api.payme.id/v2/transactions', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': LYNK_MERCHANT_KEY, // Use X-API-KEY for auth
            },
            body: JSON.stringify(paymePayload),
        });

        const paymeData = await paymeResponse.json();

        if (!paymeResponse.ok) {
            transaction.status = 'FAILED';
            await transaction.save();
            console.error('Payme.id API Error:', paymeData);
            const errorMessage = paymeData.message || (paymeData.errors ? JSON.stringify(paymeData.errors) : 'Error tidak diketahui');
            throw new Error(`Gagal membuat link pembayaran: ${errorMessage}`);
        }
        
        // Save the transaction ID from Payme.id
        transaction.providerTransactionId = paymeData.id; 
        await transaction.save();

        res.status(200).json({ paymentUrl: paymeData.payment_url });

    } catch (error: any) {
        console.error("Create transaction error:", error);
        res.status(500).json({ message: error.message || 'Server error while creating transaction.' });
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