import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../_lib/db.js';
import User from '../_lib/models/User.js';
import ReferralEarning from '../_lib/models/ReferralEarning.js';
import Withdrawal from '../_lib/models/Withdrawal.js';
import PricingConfig from '../_lib/models/PricingConfig.js';
import { protect } from '../_lib/auth.js';
import cors from 'cors';

const corsHandler = cors();

async function handleInfo(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    let authFailed = false;
    await new Promise<void>((resolve) => {
        protect(req as any, res, () => {
            resolve();
        }).catch((err) => {
            console.error('Referral info protect error:', err);
            authFailed = true;
            resolve();
        });
    });

    if (res.headersSent || authFailed) return;

    const reqUser = (req as any).user;
    if (!reqUser) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    await dbConnect();
    
    // Retrieve fresh user data to ensure up-to-date balance and referral info
    const user = await User.findById(reqUser._id).exec();
    if (!user) {
        return res.status(404).json({ message: 'User tidak ditemukan.' });
    }

    // Auto-generate referral code if missing
    if (!user.referralCode) {
        const emailPrefix = user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 5);
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        user.referralCode = `${emailPrefix}${randomStr}` || `REF${Math.floor(100000 + Math.random() * 900000)}`;
        
        let existingUser = await User.findOne({ referralCode: user.referralCode });
        while (existingUser) {
            user.referralCode = `REF${Math.floor(100000 + Math.random() * 900000)}`;
            existingUser = await User.findOne({ referralCode: user.referralCode });
        }
        await user.save();
    }

    // Fetch referred users (users registered using this referral code)
    const referredUsers = await User.find({ referredBy: user._id })
        .select('_id email createdAt')
        .sort({ createdAt: -1 })
        .exec();

    const referredUsersMapped = referredUsers.map((u) => ({
        id: u._id.toString(),
        email: u.email,
        createdAt: u.createdAt ? u.createdAt.toISOString() : new Date().toISOString()
    }));

    // Fetch referral earnings
    const earnings = await ReferralEarning.find({ referrerId: user._id })
        .sort({ createdAt: -1 })
        .exec();

    const earningsMapped = earnings.map((e) => ({
        _id: e._id.toString(),
        refereeEmail: e.refereeEmail,
        orderId: e.orderId,
        transactionAmount: e.transactionAmount,
        commissionPercent: e.commissionPercent,
        commissionAmount: e.commissionAmount,
        createdAt: e.createdAt ? e.createdAt.toISOString() : new Date().toISOString()
    }));

    // Fetch withdrawals
    const withdrawals = await Withdrawal.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .exec();

    const withdrawalsMapped = withdrawals.map((w) => ({
        _id: w._id.toString(),
        userId: w.userId.toString(),
        userEmail: w.userEmail,
        amount: w.amount,
        bankName: w.bankName,
        accountNumber: w.accountNumber,
        accountHolder: w.accountHolder,
        status: w.status,
        adminNote: w.adminNote,
        processedAt: w.processedAt ? w.processedAt.toISOString() : undefined,
        createdAt: w.createdAt ? w.createdAt.toISOString() : new Date().toISOString()
    }));

    // Fetch pricing and referral configuration
    const config = await PricingConfig.findOne().exec();
    const minWithdrawalAmount = config ? (config.minWithdrawalAmount ?? 50000) : 50000;
    const referralCommissionPercent = config ? (config.referralCommissionPercent ?? 15) : 15;
    const referralEnabled = config ? (config.referralEnabled ?? true) : true;

    return res.status(200).json({
        referralCode: user.referralCode,
        affiliateBalance: user.affiliateBalance || 0,
        totalEarnedAffiliate: user.totalEarnedAffiliate || 0,
        referredUsersCount: referredUsersMapped.length,
        referredUsers: referredUsersMapped,
        earnings: earningsMapped,
        withdrawals: withdrawalsMapped,
        config: {
            minWithdrawalAmount,
            referralCommissionPercent,
            referralEnabled
        }
    });
}

async function handleWithdraw(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    let authFailed = false;
    await new Promise<void>((resolve) => {
        protect(req as any, res, () => {
            resolve();
        }).catch((err) => {
            console.error('Referral withdraw protect error:', err);
            authFailed = true;
            resolve();
        });
    });

    if (res.headersSent || authFailed) return;

    const reqUser = (req as any).user;
    if (!reqUser) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { amount, bankName, accountNumber, accountHolder } = req.body;

    if (!amount || Number(amount) <= 0) {
        return res.status(400).json({ message: 'Nominal penarikan harus lebih dari 0.' });
    }

    if (!bankName || !accountNumber || !accountHolder) {
        return res.status(400).json({ message: 'Data rekening bank tidak lengkap.' });
    }

    await dbConnect();

    const user = await User.findById(reqUser._id).exec();
    if (!user) {
        return res.status(404).json({ message: 'User tidak ditemukan.' });
    }

    // Check pricing config for min withdrawal limit
    const config = await PricingConfig.findOne().exec();
    const minWithdrawalAmount = config ? (config.minWithdrawalAmount ?? 50000) : 50000;
    const referralEnabled = config ? (config.referralEnabled ?? true) : true;

    if (!referralEnabled) {
        return res.status(400).json({ message: 'Program afiliasi sedang dinonaktifkan.' });
    }

    if (Number(amount) < minWithdrawalAmount) {
        return res.status(400).json({ message: `Minimal penarikan adalah Rp ${minWithdrawalAmount.toLocaleString('id-ID')}.` });
    }

    const currentBalance = user.affiliateBalance || 0;
    if (Number(amount) > currentBalance) {
        return res.status(400).json({ message: 'Saldo komisi Anda tidak mencukupi.' });
    }

    // Deduct balance and create withdrawal entry
    user.affiliateBalance = currentBalance - Number(amount);
    await user.save();

    await Withdrawal.create({
        userId: user._id,
        userEmail: user.email,
        amount: Number(amount),
        bankName,
        accountNumber,
        accountHolder,
        status: 'PENDING'
    });

    return res.status(200).json({
        success: true,
        message: 'Pengajuan penarikan dana berhasil dikirim!'
    });
}

export default function handler(req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, async () => {
        const { action } = req.query;
        const actionStr = Array.isArray(action) ? action[0] : action;

        try {
            switch (actionStr) {
                case 'info':
                    return await handleInfo(req, res);
                case 'withdraw':
                    return await handleWithdraw(req, res);
                default:
                    return res.status(404).json({ message: 'Action not found' });
            }
        } catch (error: any) {
            console.error('Referral API Error:', error);
            return res.status(500).json({ message: 'Internal server error.', error: error.message });
        }
    });
}
