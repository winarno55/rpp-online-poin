import type { VercelResponse } from '@vercel/node';
import { createApiHandler } from './_lib/handler.js';
import { verifyUser, verifyAdmin, AuthRequest } from './_lib/middleware.js';
import dbConnect from './_lib/db.js';
import User from './_lib/models/User.js';

// --- Logic from users.ts ---
async function handleGetUsers(req: AuthRequest, res: VercelResponse) {
    await dbConnect();
    const users = await User.find({ role: { $ne: 'admin' } }).select('_id email points createdAt').sort({ createdAt: -1 });
    res.status(200).json(users);
}

// --- Logic from add-points.ts ---
async function handleAddPoints(req: AuthRequest, res: VercelResponse) {
    await dbConnect();
    const { email, points } = req.body;

    if (!email || !points || isNaN(Number(points)) || Number(points) <= 0) {
        res.status(400).json({ message: 'Harap berikan email yang valid dan jumlah poin positif.' });
        return;
    }

    const targetUser = await User.findOne({ email }).exec();
    if (!targetUser) {
        res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        return;
    }

    targetUser.points += Number(points);
    await targetUser.save();

    res.status(200).json({
        message: `Berhasil menambahkan ${points} poin ke ${email}. Total baru: ${targetUser.points}.`
    });
}

// --- Main Handler Logic ---
const apiHandler = async (req: AuthRequest, res: VercelResponse) => {
    // Middleware: Verifikasi bahwa pengguna adalah admin.
    // Fungsi-fungsi ini akan melempar AuthError jika verifikasi gagal,
    // yang akan ditangkap oleh createApiHandler.
    const user = await verifyUser(req);
    verifyAdmin(user);

    const { action } = req.query;

    if (req.method === 'GET' && action === 'users') {
        return await handleGetUsers(req, res);
    }

    if (req.method === 'POST' && action === 'add-points') {
        return await handleAddPoints(req, res);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(404).json({ message: `Tindakan admin '${action}' tidak ditemukan untuk metode ${req.method}` });
};

export default createApiHandler(apiHandler);