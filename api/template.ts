import type { VercelRequest, VercelResponse } from '@vercel/node';
import path from 'path';
import fs from 'fs';
import { createApiHandler } from './_lib/handler.js';

const handleRequest = async (req: VercelRequest, res: VercelResponse) => {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ message: 'Method Not Allowed' });
        return;
    }

    // vercel.json dikonfigurasi untuk menyertakan 'public/template.docx',
    // jadi process.cwd() akan menunjuk ke direktori yang benar saat runtime.
    // FIX: Use the global `process` object from the Node.js runtime environment.
    const filePath = path.join(process.cwd(), 'public', 'template.docx');

    if (!fs.existsSync(filePath)) {
        console.error('File template tidak ditemukan di:', filePath);
        res.status(404).json({ message: 'File template.docx tidak ditemukan di server.' });
        return;
    }
    
    const fileBuffer = fs.readFileSync(filePath);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.status(200).send(fileBuffer);
};

export default createApiHandler(handleRequest);