import type { VercelRequest, VercelResponse } from '@vercel/node';
import { protect } from '../_lib/auth.js';
import dbConnect from '../_lib/db.js';
import User, { IUser } from '../_lib/models/User.js';
import PricingConfig from '../_lib/models/PricingConfig.js';
import Withdrawal from '../_lib/models/Withdrawal.js';
import ReferralEarning from '../_lib/models/ReferralEarning.js';
import cors from 'cors';

const corsHandler = cors();

type AuthRequest = VercelRequest & {
  user?: IUser;
};

// --- HANDLERS ---

async function handleGetInfo(req: AuthRequest, res: VercelResponse) {
    const user = req.user!;
    
    // Fetch user details from DB to get fresh affiliateBalance and referralCode
    const currentUser = await User.findById(user._id).exec();
    if (!currentUser) return res.status(404).json({ message: 'User not found' });

    // Fetch referral config
    const config = await PricingConfig.findOne().exec();
    const minWithdrawalAmount = config ? (config.minWithdrawalAmount ?? 50000) : 50000;
    const referralCommissionPercent = config ? (config.referralCommissionPercent ?? 15) : 15;
    const referralEnabled = config ? (config.referralEnabled ?? true) : true;

    // Fetch downline users referred by this user
    const referredUsers = await User.find({ referredBy: currentUser._id })
        .select('email createdAt points')
        .sort({ createdAt: -1 })
        .exec();

    const formattedReferredUsers = referredUsers.map(u => ({
        id: u._id.toString(),
        email: u.email,
        createdAt: u.createdAt
    }));

    // Fetch commission earnings
    const earnings = await ReferralEarning.find({ referrerId: currentUser._id })
        .sort({ createdAt: -1 })
        .limit(100)
        .exec();

    // Fetch withdrawal history
    const withdrawals = await Withdrawal.find({ userId: currentUser._id })
        .sort({ createdAt: -1 })
        .limit(50)
        .exec();

    res.status(200).json({
        referralCode: currentUser.referralCode || '',
        affiliateBalance: currentUser.affiliateBalance || 0,
        totalEarnedAffiliate: currentUser.totalEarnedAffiliate || 0,
        referredUsersCount: formattedReferredUsers.length,
        referredUsers: formattedReferredUsers,
        earnings,
        withdrawals,
        config: {
            minWithdrawalAmount,
            referralCommissionPercent,
            referralEnabled
        }
    });
}

async function handleWithdraw(req: AuthRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

    const user = req.user!;
    const { amount, bankName, accountNumber, accountHolder } = req.body;

    const numAmount = Number(amount);
    if (!numAmount || isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({ message: 'Nominal penarikan tidak valid.' });
    }

    if (!bankName || !accountNumber || !accountHolder) {
        return res.status(400).json({ message: 'Mohon lengkapi informasi rekening / e-wallet.' });
    }

    await dbConnect();
    const config = await PricingConfig.findOne().exec();
    const minWithdrawalAmount = config ? (config.minWithdrawalAmount ?? 50000) : 50000;

    if (numAmount < minWithdrawalAmount) {
        return res.status(400).json({ 
            message: `Minimal penarikan adalah Rp ${minWithdrawalAmount.toLocaleString('id-ID')}.` 
        });
    }

    const currentUser = await User.findById(user._id).exec();
    if (!currentUser) return res.status(404).json({ message: 'User not found' });

    const currentBalance = currentUser.affiliateBalance || 0;
    if (numAmount > currentBalance) {
        return res.status(400).json({ 
            message: `Saldo komisi Anda tidak mencukupi (Saldo saat ini: Rp ${currentBalance.toLocaleString('id-ID')}).` 
        });
    }

    // Deduct balance immediately
    currentUser.affiliateBalance = currentBalance - numAmount;
    await currentUser.save();

    // Create withdrawal record
    const withdrawal = await Withdrawal.create({
        userId: currentUser._id,
        userEmail: currentUser.email,
        amount: numAmount,
        bankName: bankName.trim(),
        accountNumber: String(accountNumber).trim(),
        accountHolder: String(accountHolder).trim(),
        status: 'PENDING'
    });

    res.status(201).json({
        success: true,
        message: 'Pengajuan penarikan dana berhasil dikirim! Admin akan memproses dan mentransfer dana ke rekening Anda.',
        newBalance: currentUser.affiliateBalance,
        withdrawal
    });
}

// --- MAIN DISPATCHER ---

async function apiHandler(req: AuthRequest, res: VercelResponse) {
    const { action } = req.query;
    const actionStr = Array.isArray(action) ? action[0] : action;

    try {
        await dbConnect();
        switch (actionStr) {
            case 'info': return await handleGetInfo(req, res);
            case 'withdraw': return await handleWithdraw(req, res);
            default: return res.status(404).json({ message: 'Invalid referral endpoint' });
        }
    } catch (error: any) {
        console.error(`Referral API Error (${actionStr}):`, error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export default function handler(req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, () => {
        protect(req as AuthRequest, res, () => {
            if (res.headersSent) return;
            apiHandler(req as AuthRequest, res);
        });
    });
}
