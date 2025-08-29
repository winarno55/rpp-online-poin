import type { VercelRequest, VercelResponse } from '@vercel/node';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const corsHandler = cors();

const handleRequest = async (req: VercelRequest, res: VercelResponse) => {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // vercel.json sekarang dikonfigurasi untuk menyertakan 'public/template.docx' dengan fungsi ini,
        // sehingga process.cwd() akan mengarah ke direktori yang benar di lingkungan runtime fungsi.
        // FIX: Using global.process to resolve type conflicts with the 'process' object.
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
    corsHandler(req, res, () => {
        handleRequest(req, res);
    });
}