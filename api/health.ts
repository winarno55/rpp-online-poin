import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from './_lib/db.js';
import mongoose from 'mongoose';
import { createApiHandler } from './_lib/handler.js';

const healthCheckHandler = async (req: VercelRequest, res: VercelResponse) => {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ message: 'Method Not Allowed' });
        return;
    }

    // `dbConnect` akan melempar error jika gagal, yang akan ditangkap oleh `createApiHandler`
    await dbConnect();
    
    // mongoose.connection.readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
    
    if (dbState === 1) {
        res.status(200).json({ status: 'ok', db: dbStatus });
    } else {
        // Jika tidak terhubung, kembalikan status error service unavailable
        res.status(503).json({ status: 'error', db: dbStatus, message: 'Koneksi database tidak terbentuk.' });
    }
};

export default createApiHandler(healthCheckHandler);