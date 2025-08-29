import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { protect } from './_lib/auth.js';
import dbConnect from './_lib/db.js';
import User, { IUser } from './_lib/models/User.js';
import PricingConfig from './_lib/models/PricingConfig.js';
import { generateLessonPlanPrompt } from '../src/services/geminiService.js';
import { LessonPlanInput } from '../src/types.js';
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

        // Deduct points before starting the generation process
        user.points -= dynamicCost;
        await user.save();
        
        try {
            const prompt = generateLessonPlanPrompt(lessonPlanData);
            
            const responseStream = await ai.models.generateContentStream({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            // Set headers for streaming
            res.writeHead(200, {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            });
            
            for await (const chunk of responseStream) {
                if (chunk.text) {
                    res.write(chunk.text);
                }
            }
            
            res.end(); // End the stream when Gemini is done

        } catch (aiError: any) {
            console.error('Gemini API Error:', aiError);
            
            // If an AI error occurs, we have already deducted points.
            // We should not write to a response that's already started streaming.
            // This error handling will primarily catch pre-stream errors (e.g., safety violations on the prompt).
            if (!res.headersSent) {
                 // Refund points if generation fails before starting
                user.points += dynamicCost;
                await user.save();
              
                let userMessage = 'Gagal berkomunikasi dengan AI. Poin Anda telah dikembalikan.';
                if (aiError.message) {
                    if (aiError.message.toLowerCase().includes('safety')) {
                        userMessage = 'Permintaan Anda diblokir oleh filter keamanan AI. Coba ubah materi atau tujuan pembelajaran Anda. Poin Anda telah dikembalikan.';
                    }
                }
                res.status(424).json({ message: userMessage, error: aiError.message });
            } else {
                // If stream has started, we just end it. The client will see a truncated response.
                res.end();
            }
        }

    } catch (dbError: any) {
        console.error('General Server Error (DB, auth, etc.):', dbError);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Terjadi kesalahan pada server saat memproses permintaan Anda.', error: dbError.message });
        }
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
