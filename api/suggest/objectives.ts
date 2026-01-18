
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';
import { protect } from '../_lib/auth.js';
import User, { IUser } from '../_lib/models/User.js';
import { getAllGeminiApiKeys } from '../_lib/geminiKeyManager.js';
import cors from 'cors';

const corsHandler = cors();

// DAFTAR MODEL PRIORITAS (Strategi "WATERFALL")
const MODELS_TO_TRY = [
    'gemini-3-pro-preview',      // 1. Gen 3 Pro
    'gemini-3-flash-preview',    // 2. Gen 3 Flash
    'gemini-2.5-pro-preview',    // 3. Gen 2.5 Pro
    'gemini-2.0-pro-exp-02-05',  // 4. Gen 2 Pro
    'gemini-2.0-flash-exp'       // 5. Gen 2 Flash
];

type AuthRequest = VercelRequest & {
  user?: IUser;
};

const SUGGESTION_COST = 5;

async function apiHandler(req: AuthRequest, res: VercelResponse) {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    const { mataPelajaran, kelasFase, materi } = req.body;

    if (!materi || !kelasFase || !mataPelajaran) {
        return res.status(400).json({ message: 'Mata Pelajaran, Kelas/Fase, dan Materi diperlukan untuk mendapatkan saran.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(401).json({ message: 'User not found in database.' });
    }

    if (user.points < SUGGESTION_COST) {
        return res.status(403).json({ message: `Poin tidak cukup. Fitur ini membutuhkan ${SUGGESTION_COST} poin.` });
    }
    
    // Deduct points before making the API call
    user.points -= SUGGESTION_COST;
    await user.save();

    try {
        const apiKeys = getAllGeminiApiKeys();
        let finalResponse = null;
        let lastError = null;
        
        const prompt = `
            Anda adalah seorang ahli dalam desain pembelajaran. Berdasarkan informasi berikut, berikan 3 contoh Tujuan Pembelajaran yang jelas, terukur, dan relevan untuk RPP (Rencana Pelaksanaan Pembelajaran).
            - Mata Pelajaran: ${mataPelajaran}
            - Kelas/Fase: ${kelasFase}
            - Materi Pembahasan: ${materi}

            Setiap tujuan pembelajaran harus dirumuskan sebagai kalimat lengkap yang dimulai dengan "Peserta didik dapat..." atau "Melalui kegiatan..., peserta didik mampu...". Buatlah 3 variasi yang berbeda, mungkin dengan fokus pada ranah kognitif, afektif, atau psikomotor yang berbeda. Jangan berikan nomor atau bullet point, hanya hasilkan JSON.
        `;

        // LOGIKA FALLBACK BERTINGKAT
        modelLoop: for (const modelName of MODELS_TO_TRY) {
            for (let i = 0; i < apiKeys.length; i++) {
                const apiKey = apiKeys[i];
                try {
                    const ai = new GoogleGenAI({ apiKey });
                    
                    const response = await ai.models.generateContent({
                        model: modelName,
                        contents: prompt,
                        config: {
                            responseMimeType: "application/json",
                            responseSchema: {
                                type: Type.OBJECT,
                                properties: {
                                    suggestions: {
                                        type: Type.ARRAY,
                                        description: "Daftar 3 saran tujuan pembelajaran dalam format string.",
                                        items: {
                                            type: Type.STRING
                                        }
                                    }
                                }
                            }
                        }
                    });
                    
                    finalResponse = response;
                    break modelLoop; // Berhasil, keluar dari semua loop

                } catch (error: any) {
                    lastError = error;
                    const errorMessage = error.message ? error.message.toLowerCase() : '';
                    const isRetryable = errorMessage.includes('429') || errorMessage.includes('503') || errorMessage.includes('quota') || errorMessage.includes('resource exhausted');
                    
                    if (isRetryable) {
                         console.warn(`[${modelName}] Key ${i + 1} Failed for Suggestion: ${error.message}. Retrying...`);
                        continue;
                    } else {
                        // Error lain, coba key berikutnya
                        continue;
                    }
                }
            }
            console.warn(`All keys failed for Suggestion on model ${modelName}. Switching model...`);
        }

        if (!finalResponse) throw lastError;
        
        const jsonText = finalResponse.text;
        if (!jsonText) {
            throw new Error("Respons dari AI tidak berisi teks yang valid.");
        }
        
        const jsonResponse = JSON.parse(jsonText.trim());
        res.status(200).json({ ...jsonResponse, newPoints: user.points });

    } catch (aiError: any) {
        // AI call failed, so we refund the points.
        user.points += SUGGESTION_COST;
        await user.save();
        
        console.error('Gemini Suggestion API Error:', aiError);
        let userMessage = `Gagal mendapatkan saran dari AI. ${SUGGESTION_COST} poin Anda telah dikembalikan.`;
        if (aiError.message && aiError.message.toLowerCase().includes('safety')) {
            userMessage = `Permintaan Anda diblokir oleh filter keamanan AI. Coba ubah input materi Anda. ${SUGGESTION_COST} poin Anda telah dikembalikan.`;
        }
        res.status(500).json({ message: userMessage, error: aiError.message });
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
