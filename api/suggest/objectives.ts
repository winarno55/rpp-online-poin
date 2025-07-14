import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';
import { protect } from '../_lib/auth.js';
import { IUser } from '../_lib/models/User.js';
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
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    const { mataPelajaran, kelasFase, materi } = req.body;

    if (!materi || !kelasFase || !mataPelajaran) {
        return res.status(400).json({ message: 'Mata Pelajaran, Kelas/Fase, dan Materi diperlukan untuk mendapatkan saran.' });
    }

    try {
        const prompt = `
            Anda adalah seorang ahli dalam desain pembelajaran. Berdasarkan informasi berikut, berikan 3 contoh Tujuan Pembelajaran yang jelas, terukur, dan relevan untuk RPP (Rencana Pelaksanaan Pembelajaran).
            - Mata Pelajaran: ${mataPelajaran}
            - Kelas/Fase: ${kelasFase}
            - Materi Pembahasan: ${materi}

            Setiap tujuan pembelajaran harus dirumuskan sebagai kalimat lengkap yang dimulai dengan "Peserta didik dapat..." atau "Melalui kegiatan..., peserta didik mampu...". Buatlah 3 variasi yang berbeda, mungkin dengan fokus pada ranah kognitif, afektif, atau psikomotor yang berbeda. Jangan berikan nomor atau bullet point, hanya hasilkan JSON.
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
                            description: "Daftar 3 saran tujuan pembelajaran dalam format string.",
                            items: {
                                type: Type.STRING
                            }
                        }
                    }
                }
            }
        });
        
        const jsonText = response.text.trim();
        const jsonResponse = JSON.parse(jsonText);
        res.status(200).json(jsonResponse);

    } catch (aiError: any) {
        console.error('Gemini Suggestion API Error:', aiError);
        let userMessage = 'Gagal mendapatkan saran dari AI.';
        if (aiError.message && aiError.message.toLowerCase().includes('safety')) {
            userMessage = 'Permintaan Anda diblokir oleh filter keamanan AI. Coba ubah input materi Anda.';
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