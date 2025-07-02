
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
            provider: 'lynk',
        });

        const protocol = (req.headers['x-forwarded-proto'] as string) || 'http';
        const host = req.headers.host;
        const redirectUrl = `${protocol}://${host}/app/payment-status?transaction_id=${transaction._id.toString()}`;

        const lynkPayload = {
            amount: selectedPackage.price,
            description: `Top-up: ${selectedPackage.points} Poin untuk ModulAjarCerdas`,
            reference_id: transaction._id.toString(),
            customer_name: req.user!.email,
            customer_email: req.user!.email,
            redirect_url: redirectUrl,
        };
        
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
        
        transaction.providerTransactionId = lynkData.transaction_id;
        await transaction.save();

        res.status(200).json({ paymentUrl: lynkData.payment_url });

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
