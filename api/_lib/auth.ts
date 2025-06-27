import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import User, { IUser } from './models/User.js';

interface AuthRequest extends VercelRequest {
  user?: IUser;
}

type NextFunction = () => void;

// We will read the JWT_SECRET inside the protect function to avoid issues with Vercel's module caching.

export const protect = async (req: AuthRequest, res: VercelResponse, next: NextFunction) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        console.error("JWT_SECRET is not defined on the server during an auth check.");
        return res.status(500).json({ message: 'Internal server configuration error.' });
    }

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role?: string };

        // Handle the hardcoded admin user
        if (decoded.id === 'admin_user_id' && decoded.role === 'admin') {
            // Create a mock user object that satisfies the admin check middleware.
            // This object is not a full Mongoose document and should only be used for authorization checks.
            req.user = {
                _id: 'admin_user_id',
                email: 'admin',
                role: 'admin',
            } as any;
            return next();
        }
        
        const user = await User.findById(decoded.id).exec() as IUser | null;

        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        req.user = user;
        next();
    } catch (error: any) {
        let errorMessage = 'Otorisasi gagal, token bermasalah.';
        
        // Use error.name for robust error checking, avoiding `instanceof` issues in serverless environments.
        if (error && error.name === 'TokenExpiredError') {
            errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
        } else if (error && error.name === 'JsonWebTokenError') {
            // This will catch "invalid signature", "jwt malformed", etc.
            errorMessage = 'Token tidak valid atau rusak. Silakan login kembali.';
        }
        
        // Log the actual error for debugging on Vercel
        if (error && error.message) {
            console.error('Token Verification Error:', error.name, ' - ', error.message);
        } else {
            console.error('An unknown token verification error occurred:', error);
        }

        return res.status(401).json({ message: errorMessage });
    }
};

export const admin = (req: AuthRequest, res: VercelResponse, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};
