import type { VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';
import { createApiHandler } from './_lib/handler.js';
import { verifyUser, AuthRequest } from './_lib/middleware.js';
import User from './_lib/models/User.js';
import dbConnect from './_lib/db.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    throw new Error('Variabel lingkungan GEMINI_API_KEY belum diatur.');
}
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const SUGGESTION_COST = 5;

// --- Logic from suggest/objectives.ts ---
async function handleGetObjectives(req: AuthRequest, res: VercelResponse) {
    // 1. Verifikasi pengguna
    const userFromToken = await verifyUser(req);
    
    await dbConnect();
    const user = await User.findById(userFromToken._id);
    if (!user) {
        res.status(401).json({ message: 'Pengguna tidak ditemukan di database.' });
        return;
    }

    // 2. Validasi input & biaya
    const { mataPelajaran, kelasFase, materi } = req.body;
    if (!materi || !kelasFase || !mataPelajaran) {
        res.status(400).json({ message: 'Mata Pelajaran, Kelas/Fase, dan Materi diperlukan.' });
        return;
    }

    if (user.points < SUGGESTION_COST) {
        res.status(403).json({ message: `Poin tidak cukup (butuh ${SUGGESTION_COST} poin).` });
        return;
    }

    // 3. Kurangi poin dan proses permintaan
    try {
        user.points -= SUGGESTION_COST;
        await user.save();

        const prompt = `
            Anda adalah seorang ahli dalam desain pembelajaran. Berdasarkan informasi berikut, berikan 3 contoh Tujuan Pembelajaran yang jelas, terukur, dan relevan.
            - Mata Pelajaran: ${mataPelajaran}
            - Kelas/Fase: ${kelasFase}
            - Materi: ${materi}
            Setiap tujuan harus berupa kalimat lengkap. Jangan gunakan nomor atau bullet point. Hanya hasilkan JSON.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            description: "Daftar 3 saran tujuan pembelajaran.",
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["suggestions"]
                }
            }
        });
        
        const jsonText = response.text;
        if (!jsonText) {
            throw new Error("Respons dari AI kosong.");
        }
        
        const jsonResponse = JSON.parse(jsonText.trim());
        res.status(200).json({ ...jsonResponse, newPoints: user.points });

    } catch (error: any) {
        // Jika terjadi error SETELAH poin dikurangi, kembalikan poinnya.
        console.error('Error during Gemini suggestion, refunding points:', error.message);
        user.points += SUGGESTION_COST;
        await user.save();
        console.log(`Successfully refunded ${SUGGESTION_COST} points to ${user.email}`);

        let userMessage = `Gagal mendapatkan saran. ${SUGGESTION_COST} poin Anda telah dikembalikan.`;
        if (error.message?.toLowerCase().includes('safety')) {
            userMessage = `Permintaan Anda diblokir filter keamanan AI. Poin Anda telah dikembalikan.`;
        }
        throw new Error(userMessage);
    }
}

// --- Main Handler Logic ---
const apiHandler = async (req: AuthRequest, res: VercelResponse) => {
    const { action } = req.query;

    if (req.method === 'POST' && action === 'objectives') {
        return await handleGetObjectives(req, res);
    }

    res.setHeader('Allow', ['POST']);
    res.status(404).json({ message: `Tindakan saran '${action}' tidak ditemukan untuk metode ${req.method}` });
};

export default createApiHandler(apiHandler);