import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from './_lib/db';
import mongoose from 'mongoose';
import cors from 'cors';

const corsHandler = cors();

export default function handler(req: VercelRequest, res: VercelResponse) {
  corsHandler(req, res, async () => {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
      await dbConnect();
      
      // mongoose.connection.readyState
      // 0 = disconnected
      // 1 = connected
      // 2 = connecting
      // 3 = disconnecting
      const dbState = mongoose.connection.readyState;
      const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
      
      if (dbState === 1) {
        return res.status(200).json({ status: 'ok', db: dbStatus });
      } else {
        // If not connected, return a server error status
        return res.status(503).json({ status: 'error', db: dbStatus, message: 'Database connection is not established.' });
      }

    } catch (error: any) {
      console.error("Health Check Error:", error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to connect to the database.',
        error: error.message
      });
    }
  });
}
