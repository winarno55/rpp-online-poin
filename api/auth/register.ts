import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../_lib/db';
import User from '../_lib/models/User';
import cors from 'cors';

const corsHandler = cors();

export default function handler(req: VercelRequest, res: VercelResponse) {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

    await dbConnect();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
      const userExists = await User.findOne({ email }).exec();

      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      await User.create({
        email,
        password,
      });

      res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
}
