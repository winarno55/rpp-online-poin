import type { VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { createApiHandler } from './_lib/handler.js';
import { verifyUser, AuthRequest } from './_lib/middleware.js';
import dbConnect from './_lib/db.js';
import User from './_lib/models/User.js';
import PricingConfig from './_lib/models/PricingConfig.js';
import { generateLessonPlanPrompt } from '../shared/geminiService.js';
import { LessonPlanInput } from '../shared/types.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    throw new Error('Variabel lingkungan GEMINI_API_KEY belum diatur.');
}
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function apiHandler(req: AuthRequest, res: VercelResponse) {
    // 1. Verifikasi pengguna. Melempar error jika tidak valid.
    const userFromToken = await verifyUser(req);
    
    // Admin tidak diizinkan untuk generate.
    if (userFromToken.role === 'admin') {
        res.status(403).json({ message: 'Admin tidak dapat membuat modul ajar.' });
        return;
    }
    
    await dbConnect();
    const user = await User.findById(userFromToken._id);
    if (!user) {
        // Kasus langka di mana user ada di token tapi tidak di DB
        res.status(401).json({ message: 'Pengguna tidak ditemukan di database.' });
        return;
    }

    // 2. Hitung biaya
    const lessonPlanData: LessonPlanInput = req.body;
    const numSessions = parseInt(lessonPlanData.jumlahPertemuan) || 1;
    
    const pricingConfig = await PricingConfig.findOne().exec();
    if (!pricingConfig?.sessionCosts?.length) {
        throw new Error('Konfigurasi biaya belum diatur oleh admin.');
    }
    
    const costConfig = pricingConfig.sessionCosts.find(sc => sc.sessions === numSessions);
    const dynamicCost = costConfig?.cost;

    if (dynamicCost === undefined) {
        throw new Error(`Tidak ada konfigurasi biaya untuk ${numSessions} sesi.`);
    }

    if (user.points < dynamicCost) {
        res.status(403).json({ message: `Poin Anda tidak cukup (butuh ${dynamicCost} poin).` });
        return;
    }

    // 3. Kurangi poin dan proses permintaan
    // Blok try...finally memastikan poin dikembalikan jika terjadi error selama streaming
    try {
        user.points -= dynamicCost;
        await user.save();

        const prompt = generateLessonPlanPrompt(lessonPlanData);
        
        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

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
        
        res.end();

    } catch (error: any) {
        // Jika terjadi error SETELAH poin dikurangi, kembalikan poinnya.
        console.error('Error during Gemini stream, refunding points:', error.message);
        user.points += dynamicCost;
        await user.save();
        console.log(`Successfully refunded ${dynamicCost} points to ${user.email}`);

        // Melempar error lagi agar ditangkap oleh handler utama dan dikirim ke client.
        let userMessage = 'Gagal memproses permintaan Anda. Poin Anda telah dikembalikan.';
        if (error.message?.toLowerCase().includes('safety')) {
            userMessage = 'Permintaan Anda diblokir oleh filter keamanan AI. Coba ubah materi Anda. Poin Anda telah dikembalikan.';
        }
        throw new Error(userMessage);
    }
}

export default createApiHandler(apiHandler);