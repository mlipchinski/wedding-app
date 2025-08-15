import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const signJwt = <T extends object>(payload: T, emailToken: boolean = false) => {
    if (emailToken) {
        return jwt.sign(payload, env.emailVerifyJwtSecret, { expiresIn: env.emailVerifyJwtExpiresIn});
    }
    else {
        return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
    }
}

export const verifyJwt = <T>(token: string, emailToken: boolean = false): T | null => {
    try {
        if (emailToken) {
            return jwt.verify(token, env.emailVerifyJwtSecret) as T;
        }
        else {
            return jwt.verify(token, env.jwtSecret) as T;
        }
    } catch {
        return null;
    }
}

export const decodeJwt = <T>(token: string): T | null => {
    try {
        return jwt.decode(token) as T;
    } catch {
        return null;
    }
}