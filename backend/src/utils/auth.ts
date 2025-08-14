import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const signJwt = <T extends object>(payload: T) => {
    return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export const verifyJwt = <T>(token: string): T | null => {
    try {
        return jwt.verify(token, env.jwtSecret) as T;
    } catch {
        return null;
    }
}
