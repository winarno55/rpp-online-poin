import type { VercelRequest } from '@vercel/node';
import jwt from 'jsonwebtoken';
import User, { IUser } from './models/User.js';
import dbConnect from './db.js';

export type AuthRequest = VercelRequest & {
  user?: IUser;
};

// Error kustom untuk membedakan error otentikasi dari error server lainnya.
export class AuthError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

/**
 * Memverifikasi token JWT dari request, menemukan pengguna terkait, dan mengembalikannya.
 * Melempar `AuthError` jika token tidak ada, tidak valid, atau pengguna tidak ditemukan.
 * Ini menggantikan pola callback `protect(req, res, next)` yang lama.
 */
export const verifyUser = async (req: AuthRequest): Promise<IUser> => {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        console.error("JWT_SECRET is not defined in the environment.");
        throw new Error('Internal server configuration error.'); // Ini akan menjadi error 500
    }

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        throw new AuthError('Otorisasi gagal, token tidak ditemukan.');
    }

    try {
        await dbConnect();
        
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role?: string };

        // Handle hardcoded admin user for backward compatibility if needed
        if (decoded.id === 'admin_user_id' && decoded.role === 'admin') {
            const adminUser: IUser = {
                _id: 'admin_user_id' as any,
                email: 'admin',
                role: 'admin',
                points: 9999,
            } as IUser;
            req.user = adminUser;
            return adminUser;
        }

        const user = await User.findById(decoded.id).exec();
        if (!user) {
            throw new AuthError('Otorisasi gagal, pengguna tidak ditemukan.');
        }

        req.user = user;
        return user;

    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            throw new AuthError('Sesi Anda telah berakhir. Silakan login kembali.');
        }
        if (error.name === 'JsonWebTokenError') {
            throw new AuthError('Token tidak valid atau rusak. Silakan login kembali.');
        }
        // Lemparkan kembali error lainnya sebagai AuthError umum
        throw new AuthError(`Otorisasi token gagal: ${error.message}`);
    }
};

/**
 * Memeriksa apakah pengguna yang terotentikasi memiliki peran 'admin'.
 * Melempar `AuthError` dengan status 403 (Forbidden) jika bukan admin.
 */
export const verifyAdmin = (user: IUser) => {
    if (user.role !== 'admin') {
        throw new AuthError('Tidak memiliki hak akses sebagai admin.', 403);
    }
};