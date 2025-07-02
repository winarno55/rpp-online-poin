import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { protect } from './_lib/auth';
import dbConnect from './_lib/db';
import User, { IUser } from './_lib/models/User';
import PricingConfig from './_lib/models/PricingConfig';
import { generateLessonPlanPrompt } from '../src/services/geminiService';
import { LessonPlanInput } from '../src/types';
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
    // This outer try-catch will handle DB connection errors, user fetching errors, etc.
    try {
        await dbConnect();

        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        if (req.user.role === 'admin') {
            return res.status(403).json({ message: 'Admin users cannot generate lesson plans.' });
        }
        
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }
        
        const lessonPlanData: LessonPlanInput = req.body;
        const numSessions = parseInt(lessonPlanData.jumlahPertemuan) || 1;
        
        const pricingConfig = await PricingConfig.findOne().exec();
        if (!pricingConfig || !pricingConfig.sessionCosts || pricingConfig.sessionCosts.length === 0) {
            return res.status(500).json({ message: 'Konfigurasi biaya belum diatur oleh admin.' });
        }
        
        const costConfig = pricingConfig.sessionCosts.find(sc => sc.sessions === numSessions);
        if (!costConfig) {
            return res.status(400).json({ message: `Tidak ada konfigurasi biaya untuk ${numSessions} sesi.` });
        }
        const dynamicCost = costConfig.cost;

        if (user.points < dynamicCost) {
            return res.status(403).json({ message: `Poin Anda tidak cukup untuk membuat modul ajar ${numSessions} sesi (butuh ${dynamicCost} poin).` });
        }
    
        // ---- Start of the new, smarter error handling ----
        let lessonPlan;
        try {
            const prompt = generateLessonPlanPrompt(lessonPlanData);
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-preview-04-17',
                contents: prompt,
            });
            
            lessonPlan = response.text;
            
            if (!lessonPlan || lessonPlan.trim() === "") {
                throw new Error('AI mengembalikan respons kosong.');
            }
        } catch (aiError: any) {
            console.error('Gemini API Error:', aiError);
            
            let userMessage = 'Gagal berkomunikasi dengan AI. Ini bisa terjadi jika permintaan terlalu kompleks atau ada gangguan sementara. Silakan coba lagi.';
            
            if (aiError.message) {
                 if (aiError.message.toLowerCase().includes('safety')) {
                    userMessage = 'Permintaan Anda diblokir oleh filter keamanan AI. Coba ubah materi atau tujuan pembelajaran Anda.';
                 } else if (aiError.message.toLowerCase().includes('deadline_exceeded') || aiError.message.toLowerCase().includes('timeout')) {
                    userMessage = 'Permintaan Anda membutuhkan waktu terlalu lama untuk diproses oleh server AI (timeout). Coba kurangi jumlah pertemuan atau sederhanakan materi Anda.';
                 } else if (aiError.message.includes('respons kosong')) {
                    userMessage = 'AI berhasil dihubungi namun mengembalikan respons kosong. Coba lagi dengan prompt yang berbeda.';
                 }
            } else {
                 userMessage = 'Gagal berkomunikasi dengan AI. Ini bisa terjadi jika permintaan terlalu lama diproses (timeout) atau ada gangguan sementara. Silakan coba lagi.';
            }

            // Return a specific error status (like 424 Failed Dependency) and DO NOT deduct points.
            return res.status(424).json({ message: userMessage, error: aiError.message });
        }
        // ---- End of the new, smarter error handling ----

        // This part only runs if the AI call was successful.
        user.points -= dynamicCost;
        await user.save();

        res.status(200).json({
            lessonPlan,
            newPoints: user.points,
        });

    } catch (dbError: any) {
        // This outer catch now primarily handles database errors or other unexpected server issues.
        console.error('General Server Error (DB, etc.):', dbError);
        res.status(500).json({ message: 'Terjadi kesalahan pada server saat memproses permintaan Anda.', error: dbError.message });
    }
}

// The wrapper code remains the same.
export default function (req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, () => {
        protect(req as AuthRequest, res, () => {
            if (res.headersSent) return;
            apiHandler(req as AuthRequest, res);
        });
    });
};