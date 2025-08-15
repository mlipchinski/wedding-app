//Add auth middleware to protect routes
import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/auth';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = verifyJwt(token);
        req.body = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};