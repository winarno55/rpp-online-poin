import type { VercelRequest, VercelResponse } from '@vercel/node';
import { protect } from '../_lib/auth.js';
import dbConnect from '../_lib/db.js';
import User, { IUser } from '../_lib/models/User.js';
import PricingConfig from '../_lib/models/PricingConfig.js';
import Transaction from '../_lib/models/Transaction.js';
import cors from 'cors';
import crypto from 'crypto';

const corsHandler = cors();

type AuthRequest = VercelRequest & {
  user?: IUser;
};

async function apiHandler(req: AuthRequest, res: VercelResponse) {
    await dbConnect();

    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    const { packageId } = req.body;
    if (!packageId) {
        return res.status(400).json({ message: 'Package ID is required.' });
    }

    try {
        const pricingConfig = await PricingConfig.findOne().exec();
        if (!pricingConfig) {
            return res.status(500).json({ message: 'Pricing configuration not found.' });
        }

        const selectedPackage = pricingConfig.pointPackages.find(p => p._id.toString() === packageId);
        if (!selectedPackage) {
            return res.status(404).json({ message: 'Selected package not found.' });
        }

        // Buat transaksi di database kita
        const transaction = await Transaction.create({
            userId: req.user._id,
            packageId: selectedPackage._id,
            points: selectedPackage.points,
            price: selectedPackage.price,
            status: 'PENDING',
            provider: 'lynk',
            providerTransactionId: `sim_lynk_${crypto.randomBytes(12).toString('hex')}`
        });

        // Dalam aplikasi nyata, Anda akan memanggil API Lynk di sini untuk membuat tautan pembayaran.
        // Untuk simulasi, kita buat URL yang mengarah ke halaman status pembayaran kita.
        const protocol = (req.headers['x-forwarded-proto'] as string) || 'http';
        const host = req.headers.host;
        const paymentUrl = `${protocol}://${host}/app/payment/status?transaction_id=${transaction._id.toString()}`;

        res.status(200).json({ paymentUrl });

    } catch (error: any) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ message: 'Server error while creating transaction.', error: error.message });
    }
}

export default function (req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, () => {
        protect(req as AuthRequest, res, () => {
            if (res.headersSent) return;
            apiHandler(req as AuthRequest, res);
        });
    });
};