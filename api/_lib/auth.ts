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
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        const user = await User.findById(decoded.id).exec() as IUser | null;

        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

export const admin = (req: AuthRequest, res: VercelResponse, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};