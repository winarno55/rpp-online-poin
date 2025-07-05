import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { protect } from './_lib/auth.js';
import dbConnect from './_lib/db.js';
import User, { IUser } from './_lib/models/User.js';
import { generateBankSoalPrompt } from '../src/services/geminiService.js';
import { BankSoalInput } from '../src/types.js';
import { COST_BANK_SOAL } from '../src/constants.js';
import cors from 'cors';

const corsHandler = cors();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    throw new Error('Please define the GEMINI_API_KEY environment variable');
}
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

type AuthRequest = VercelRequest & {
  user?: IUser;
};

async function apiHandler(req: AuthRequest, res: VercelResponse) {
    try {
        await dbConnect();

        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        if (req.user.role === 'admin') {
            return res.status(403).json({ message: 'Admin users cannot use this feature.' });
        }
        
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }
        
        const cost = COST_BANK_SOAL;

        if (user.points < cost) {
            return res.status(403).json({ message: `Poin Anda tidak cukup (butuh ${cost} poin).` });
        }
        
        const bankSoalData: BankSoalInput = req.body;
        
        let soal;
        try {
            const prompt = generateBankSoalPrompt(bankSoalData);
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-preview-04-17',
                contents: prompt,
            });
            
            soal = response.text;
            
            if (!soal || soal.trim() === "") {
                throw new Error('AI mengembalikan respons kosong.');
            }
        } catch (aiError: any) {
            console.error('Gemini API Error:', aiError);
            let userMessage = 'Gagal berkomunikasi dengan AI. Silakan coba lagi.';
            if (aiError.message && aiError.message.toLowerCase().includes('safety')) {
                userMessage = 'Permintaan Anda diblokir oleh filter keamanan AI. Coba ubah materi atau petunjuk Anda.';
            }
            return res.status(424).json({ message: userMessage, error: aiError.message });
        }

        user.points -= cost;
        await user.save();

        res.status(200).json({
            soal,
            newPoints: user.points,
        });

    } catch (dbError: any) {
        console.error('General Server Error (DB, etc.):', dbError);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: dbError.message });
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