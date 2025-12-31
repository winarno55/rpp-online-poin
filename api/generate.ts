
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
            // RETRY LOGIC / FALLBACK SYSTEM
            // 1. Get all available keys (shuffled)
            const apiKeys = getAllGeminiApiKeys();
            let responseStream = null;
            let lastError = null;
            let usedKeyIndex = 0;

            const prompt = generateLessonPlanPrompt(lessonPlanData);

            // 2. Loop through keys until one works or all fail
            for (const apiKey of apiKeys) {
                try {
                    // Initialize AI instance with current key
                    const ai = new GoogleGenAI({ apiKey });
                    
                    // Attempt to connect/stream
                    // Note: generateContentStream typically throws immediately if 429/quota occurs
                    const stream = await ai.models.generateContentStream({
                        model: 'gemini-2.5-flash',
                        contents: prompt,
                    });
                    
                    responseStream = stream;
                    // If successful, break the loop
                    break; 

                } catch (error: any) {
                    lastError = error;
                    usedKeyIndex++;
                    
                    // Check if error is related to Rate Limit (429) or Server Error (503)
                    const errorMessage = error.message ? error.message.toLowerCase() : '';
                    const isRetryable = errorMessage.includes('429') || errorMessage.includes('503') || errorMessage.includes('quota');
                    
                    if (isRetryable && usedKeyIndex < apiKeys.length) {
                        console.warn(`Gemini API Error (Key ${usedKeyIndex}): ${error.message}. Retrying with next key...`);
                        continue; // Try next key
                    } else {
                        // If it's a safety error or we ran out of keys, throw to the outer catch
                        throw error;
                    }
                }
            }

            if (!responseStream) {
                throw lastError || new Error("Gagal terhubung ke semua server AI.");
            }

            // Set headers for streaming only after successful connection
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
            console.error('All Gemini Keys Failed:', aiError);
            
            // If an AI error occurs, we have already deducted points.
            // We should not write to a response that's already started streaming.
            if (!res.headersSent) {
                 // Refund points if generation fails before starting
                user.points += dynamicCost;
                await user.save();
              
                let userMessage = 'Gagal berkomunikasi dengan AI. Poin Anda telah dikembalikan.';
                if (aiError.message) {
                    if (aiError.message.toLowerCase().includes('safety')) {
                        userMessage = 'Permintaan Anda diblokir oleh filter keamanan AI. Coba ubah materi atau tujuan pembelajaran Anda. Poin Anda telah dikembalikan.';
                    } else if (aiError.message.includes('429') || aiError.message.toLowerCase().includes('quota')) {
                         userMessage = 'Server sedang sangat sibuk (Semua API Key limit). Silakan coba beberapa saat lagi. Poin Anda telah dikembalikan.';
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
