import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { protect } from './_lib/auth.js';
import dbConnect from './_lib/db.js';
import User, { IUser } from './_lib/models/User.js';
// We need to manually import this from the `src` directory
import { generateLessonPlanPrompt } from '../src/services/geminiService.js';
import { LessonPlanInput } from '../src/types.js';
import cors from 'cors';

const corsHandler = cors();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    throw new Error('Please define the GEMINI_API_KEY environment variable');
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const POINTS_PER_GENERATION = 20;

interface AuthRequest extends VercelRequest {
  user?: IUser;
}

async function apiHandler(req: AuthRequest, res: VercelResponse) {
    try {
        await dbConnect();

        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Admins should not use this endpoint to generate RPPs.
        if (req.user.role === 'admin') {
            return res.status(403).json({ message: 'Admin users cannot generate lesson plans.' });
        }
        
        // Re-fetch the user from the database to ensure it's a full Mongoose document.
        // This is a robust way to avoid issues in serverless environments where object prototypes can get lost.
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }

        if (user.points < POINTS_PER_GENERATION) {
            return res.status(403).json({ message: `Poin Anda tidak cukup. Untuk menambah poin, silakan hubungi admin di 082232835976.` });
        }
    
        const lessonPlanData: LessonPlanInput = req.body;
        const prompt = generateLessonPlanPrompt(lessonPlanData);
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: prompt,
        });

        const lessonPlan = response.text;
        
        if (!lessonPlan) {
            return res.status(500).json({ message: 'Gagal menghasilkan RPP dari AI.' });
        }

        // Deduct points and save the user document
        user.points -= POINTS_PER_GENERATION;
        await user.save();

        res.status(200).json({
            lessonPlan,
            newPoints: user.points,
        });

    } catch (error: any) {
        console.error('API Error (DB or Gemini):', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server saat membuat RPP.', error: error.message });
    }
}

// Wrap the main handler with middlewares
export default function (req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, () => {
        // Since we are not using a full express app, we call the middleware manually
        protect(req as AuthRequest, res, () => {
            if (res.headersSent) return; // if protect middleware sent a response, stop here
            apiHandler(req as AuthRequest, res);
        });
    });
};