export const maxDuration = 300;

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai';
import { protect } from './_lib/auth.js';
import dbConnect from './_lib/db.js';
import User, { IUser } from './_lib/models/User.js';
import PricingConfig from './_lib/models/PricingConfig.js';
import { generateLessonPlanPrompt } from '../src/services/geminiService.js';
import { LessonPlanInput } from '../src/types.js';
import { getAllGeminiApiKeys } from './_lib/geminiKeyManager.js';
import { buildGeminiContents } from './_lib/cpLoader.js';
import cors from 'cors';

const corsHandler = cors();

// DAFTAR MODEL PRIORITAS (STRATEGI STABILITAS TINGGI)
// Prioritaskan model produksi berkapasitas besar & stabil (2.5 & 2.0 Flash)
// untuk mencegah error 503 (High Demand / UNAVAILABLE), dengan fallback ke Gen 3.
const STABLE_PRODUCTION_MODELS = [
    'gemini-2.5-flash',
    'gemini-2.0-flash'
];

const GEN3_MODELS = [
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3.1-pro-preview'
].sort(() => Math.random() - 0.5);

const MODELS_TO_TRY = [...STABLE_PRODUCTION_MODELS, ...GEN3_MODELS];

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

        // Validasi poin sukses. Deduct poin dipindah ke akhir agar aman jika terpotong.
        
        try {
            const apiKeys = getAllGeminiApiKeys();
            let responseStream = null;
            let lastError = null;
            let successModel = '';

            const prompt = generateLessonPlanPrompt(lessonPlanData);
            const contentsPayload = buildGeminiContents(prompt, lessonPlanData.mataPelajaran);

            // LOGIKA FALLBACK BERTINGKAT
            // Loop Luar: Iterasi Model sesuai urutan Waterfall
            modelLoop: for (const modelName of MODELS_TO_TRY) {
                // Loop Dalam: Iterasi Semua API Key untuk model tersebut
                for (let i = 0; i < apiKeys.length; i++) {
                    const apiKey = apiKeys[i];
                    
                    try {
                        const ai = new GoogleGenAI({ apiKey });
                        const hasSearch = false; // Disabled to save execution time and prevent Vercel 60s timeout
                        let stream;
                        
                        if (hasSearch) {
                            try {
                                stream = await ai.models.generateContentStream({
                                    model: modelName,
                                    contents: contentsPayload as any,
                                    config: {
                                        tools: [{ googleSearch: {} }],
                                        maxOutputTokens: 8192,
                                        safetySettings: [
                                            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                                            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                                            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                                            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE }
                                        ]
                                    }
                                });
                            } catch (searchError: any) {
                                console.warn(`[${modelName}] Key ${i + 1} failed with Google Search: ${searchError.message}. Retrying without search...`);
                                stream = await ai.models.generateContentStream({
                                    model: modelName,
                                    contents: contentsPayload as any,
                                    config: {
                                        maxOutputTokens: 8192,
                                        safetySettings: [
                                            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                                            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                                            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                                            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE }
                                        ]
                                    }
                                });
                            }
                        } else {
                            stream = await ai.models.generateContentStream({
                                model: modelName,
                                contents: contentsPayload as any,
                                config: {
                                    maxOutputTokens: 8192,
                                    safetySettings: [
                                        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                                        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                                        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                                        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE }
                                    ]
                                }
                            });
                        }
                        
                        
                        const iterator = stream[Symbol.asyncIterator]();
                        const firstResult = await iterator.next();
                        
                        responseStream = {
                            async *[Symbol.asyncIterator]() {
                                if (!firstResult.done) {
                                    yield firstResult.value;
                                }
                                yield* iterator;
                            }
                        };
                        successModel = modelName;
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
            
            // POTONG POIN HANYA JIKA SELESAI (SUKSES)
            user.points -= dynamicCost;
            await user.save({ validateBeforeSave: false });
            
            res.write('\n\n[INFO SISTEM: Pembuatan selesai. ' + dynamicCost + ' poin telah digunakan.]');
            res.end();

        } catch (aiError: any) {
            console.error('All Gemini Models & Keys Failed:', aiError);
            
            if (!res.headersSent) {
                 // Poin belum dipotong, jadi tidak perlu refund.
              
                let userMessage = 'Gagal berkomunikasi dengan AI. Poin Anda belum dipotong.';
                if (aiError.message) {
                    if (aiError.message.toLowerCase().includes('safety')) {
                        userMessage = 'Permintaan Anda diblokir oleh filter keamanan AI. Coba ubah materi atau tujuan pembelajaran Anda. Poin Anda belum dipotong.';
                    } else if (aiError.message.includes('429') || aiError.message.toLowerCase().includes('quota')) {
                         userMessage = 'Server sedang sangat sibuk (Semua kuota API habis). Silakan coba beberapa saat lagi. Poin Anda belum dipotong.';
                    }
                }
                res.status(424).json({ message: userMessage, error: aiError.message });
            } else {
                res.write('\n\n[INFO SISTEM: Maaf, teks terpotong. Alasan: ' + (aiError.message || 'Waktu eksekusi habis/Server terputus') + ']');
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
