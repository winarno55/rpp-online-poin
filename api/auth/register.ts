import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../_lib/db.js';
import User, { IUser } from '../_lib/models/User.js';
import cors from 'cors';

const corsHandler = cors();

export default function handler(req: VercelRequest, res: VercelResponse) {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
      await dbConnect();

      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
      }

      const lowercasedEmail = email.toLowerCase();

      // Case-insensitive check for existing user
      const userExists = await User.findOne({ email: new RegExp(`^${lowercasedEmail}$`, 'i') }).exec();

      if (userExists) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      // Store new user with lowercased email
      await User.create({
        email: lowercasedEmail,
        password,
      });

      res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (error: any) {
      console.error("Registration Error:", error);
      res.status(500).json({ message: 'Terjadi kesalahan pada server saat registrasi.', error: error.message });
    }
  });
}