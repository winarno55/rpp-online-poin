import type { VercelRequest, VercelResponse } from '@vercel/node';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
// Fix for "Property 'cwd' does not exist on type 'Process'".
// Explicitly import the 'process' module to ensure TypeScript has the correct type definitions.
import * as process from 'process';

const corsHandler = cors();

const handleRequest = async (req: VercelRequest, res: VercelResponse) => {
    // This inner try-catch handles file system errors specifically.
    try {
        if (req.method !== 'GET') {
            res.setHeader('Allow', ['GET']);
            return res.status(405).json({ message: 'Method Not Allowed' });
        }

        // vercel.json is now configured to include 'public/template.docx' with this function,
        // so process.cwd() will point to the correct directory in the function's runtime environment.
        const filePath = path.join(process.cwd(), 'public', 'template.docx');

        if (!fs.existsSync(filePath)) {
            console.error('Template file not found at:', filePath);
            return res.status(404).json({ message: 'File template.docx tidak ditemukan di server.' });
        }
        
        const fileBuffer = fs.readFileSync(filePath);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.status(200).send(fileBuffer);

    } catch (error: any) {
        console.error('Error serving template.docx:', error);
        // Ensure a response is sent even if headers are already partially set.
        if (!res.headersSent) {
            res.status(500).json({ message: 'Gagal menyajikan file template.', error: error.message });
        }
    }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // This top-level try-catch is the final safety net.
    try {
        await new Promise((resolve, reject) => {
            corsHandler(req, res, (err) => {
                if (err) return reject(err);
                resolve(undefined);
            });
        });
        await handleRequest(req, res);
    } catch (error: any) {
        console.error(`[FATAL API ERROR: /api/template]`, error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Terjadi kesalahan fatal pada server.", error: error.message });
        }
    }
}