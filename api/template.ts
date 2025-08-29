import type { VercelRequest, VercelResponse } from '@vercel/node';
import path from 'path';
import fs from 'fs';
// Fix: Import the 'process' module to explicitly provide type definitions for process.cwd().
// This resolves the error "Property 'cwd' does not exist on type 'Process'".
import process from 'process';
import cors from 'cors';

const corsHandler = cors();

const handleRequest = async (req: VercelRequest, res: VercelResponse) => {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
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
        res.status(500).json({ message: 'Gagal menyajikan file template.', error: error.message });
    }
};

export default function handler(req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, async () => {
        await handleRequest(req, res);
    });
}