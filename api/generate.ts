import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { protect } from './_lib/auth.js';
import dbConnect from './_lib/db.js';
import User, { IUser } from './_lib/models/User.js';
import PricingConfig from './_lib/models/PricingConfig.js';
import { generateLessonPlanPrompt } from '../shared/geminiService.js';
import { LessonPlanInput } from '../shared/types.js';
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
    let userToRefund: IUser | null = null;
    let costToRefund = 0;

    try {
        // Middleware-style protection
        let authenticated = false;
        await new Promise<void>((resolve) => {
            protect(req, res, () => {
                authenticated = true;
                resolve();
            });
        });

        if (!authenticated) {
            // Response already sent by 'protect'
            return;
        }

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
        
        // Prepare for potential refund
        userToRefund = user;
        costToRefund = dynamicCost;
        
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

    } catch (error: any) {
        console.error('Error in /api/generate:', error);

        // Refund points if they were deducted
        if (userToRefund && costToRefund > 0) {
            try {
                userToRefund.points += costToRefund;
                await userToRefund.save();
                console.log(`Successfully refunded ${costToRefund} points to ${userToRefund.email}`);
            } catch (refundError) {
                console.error('CRITICAL: Failed to refund points after an error:', refundError);
            }
        }

        if (!res.headersSent) {
            let userMessage = 'Gagal memproses permintaan Anda. Poin Anda telah dikembalikan.';
            if (error.message && error.message.toLowerCase().includes('safety')) {
                userMessage = 'Permintaan Anda diblokir oleh filter keamanan AI. Coba ubah materi atau tujuan pembelajaran Anda. Poin Anda telah dikembalikan.';
            } else if (error.message) {
                 userMessage = `Terjadi kesalahan: ${error.message}. Poin Anda telah dikembalikan.`
            }
            res.status(500).json({ message: userMessage });
        } else {
             res.end();
        }
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    await new Promise((resolve) => corsHandler(req, res, resolve));
    await apiHandler(req as AuthRequest, res);
}