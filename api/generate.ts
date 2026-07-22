
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { protect } from './_lib/auth.js';
import dbConnect from './_lib/db.js';
import User, { IUser } from './_lib/models/User.js';
import PricingConfig from './_lib/models/PricingConfig.js';
import { generateLessonPlanPrompt } from '../src/services/geminiService.js';
import { LessonPlanInput } from '../src/types.js';
import { getAllGeminiApiKeys } from './_lib/geminiKeyManager.js';
import cors from 'cors';

const corsHandler = cors();

// DAFTAR MODEL PRIORITAS (STRATEGI "WATERFALL")
// Konsep: Coba Pro -> Flash di setiap Generasi (3 -> 2.5 -> 2).
// Ini menyeimbangkan Kualitas Tertinggi dengan Ketersediaan.
const MODELS_TO_TRY = [
    'gemini-3.5-flash',          // Latest Gen 3.5 Flash
    'gemini-3.1-pro-preview',    // 1. Gen 3.1 Pro (Kualitas Tertinggi)
    'gemini-3-flash-preview',    // 2. Gen 3 Flash (Kecepatan Tertinggi)
    'gemini-2.5-pro-preview',    // 3. Gen 2.5 Pro (Penalaran Kuat)
    'gemini-2.0-pro-exp-02-05'   // 4. Gen 2.0 Pro (Kualitas Stabil)
];

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
        await user.save({ validateBeforeSave: false });
        
        try {
            const apiKeys = getAllGeminiApiKeys();
            let responseStream = null;
            let lastError = null;
            let successModel = '';

            const prompt = generateLessonPlanPrompt(lessonPlanData);

            // LOGIKA FALLBACK BERTINGKAT
            // Loop Luar: Iterasi Model sesuai urutan Waterfall
            modelLoop: for (const modelName of MODELS_TO_TRY) {
                // Loop Dalam: Iterasi Semua API Key untuk model tersebut
                for (let i = 0; i < apiKeys.length; i++) {
                    const apiKey = apiKeys[i];
                    
                    try {
                        const ai = new GoogleGenAI({ apiKey });
                        const hasSearch = modelName.startsWith('gemini-3');
                        let stream;
                        
                        if (hasSearch) {
                            try {
                                stream = await ai.models.generateContentStream({
                                    model: modelName,
                                    contents: prompt,
                                    config: {
                                        tools: [{ googleSearch: {} }]
                                    }
                                });
                            } catch (searchError: any) {
                                console.warn(`[${modelName}] Key ${i + 1} failed with Google Search: ${searchError.message}. Retrying without search...`);
                                stream = await ai.models.generateContentStream({
                                    model: modelName,
                                    contents: prompt
                                });
                            }
                        } else {
                            stream = await ai.models.generateContentStream({
                                model: modelName,
                                contents: prompt
                            });
                        }
                        
                        responseStream = stream;
                        successModel = modelName;
                        
                        // Jika berhasil, keluar dari KEDUA loop (break label)
                        break modelLoop; 

                    } catch (error: any) {
                        lastError = error;
                        console.warn(`[${modelName}] Key ${i + 1} Failed: ${error.message}`);
                    }
                }
                console.warn(`All keys failed for model ${modelName}. Switching to next model...`);
            }

            if (!responseStream) {
                throw lastError || new Error("Gagal terhubung ke semua server AI dengan semua API Key yang tersedia.");
            }

            // Set headers for streaming only after successful connection
            res.writeHead(200, {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'X-Model-Used': successModel // Opsional: memberitahu frontend model mana yang akhirnya dipakai
            });
            
            for await (const chunk of responseStream) {
                if (chunk.text) {
                    res.write(chunk.text);
                }
            }
            
            res.end();

        } catch (aiError: any) {
            console.error('All Gemini Models & Keys Failed:', aiError);
            
            if (!res.headersSent) {
                 // Refund points
                user.points += dynamicCost;
                await user.save({ validateBeforeSave: false });
              
                let userMessage = 'Gagal berkomunikasi dengan AI. Poin Anda telah dikembalikan.';
                if (aiError.message) {
                    if (aiError.message.toLowerCase().includes('safety')) {
                        userMessage = 'Permintaan Anda diblokir oleh filter keamanan AI. Coba ubah materi atau tujuan pembelajaran Anda. Poin Anda telah dikembalikan.';
                    } else if (aiError.message.includes('429') || aiError.message.toLowerCase().includes('quota')) {
                         userMessage = 'Server sedang sangat sibuk (Semua kuota API habis). Silakan coba beberapa saat lagi. Poin Anda telah dikembalikan.';
                    }
                }
                res.status(424).json({ message: userMessage, error: aiError.message });
            } else {
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

export default function (req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, () => {
        protect(req as AuthRequest, res, () => {
            if (res.headersSent) return;
            apiHandler(req as AuthRequest, res);
        });
    });
};
