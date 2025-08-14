import dotenv from 'dotenv';
dotenv.config();

const n = process.env;

export const env = {
    nodeEnv: n.NODE_ENV ?? 'development',
    port: Number(n.PORT ?? 4000),
    dbUrl: n.DATABASE_URL ?? '',
    clientOrigin: n.CLIENT_ORIGIN ?? 'http://localhost:5173',
    jwtSecret: n.JWT_SECRET ?? 'secret_wedding_app_jsonwebtoken_key',
    jwtExpiresIn: n.JWT_EXPIRES_IN ?? '1d',
    rateLimitWindowMs: Number(n.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000),
    rateLimitMax: Number(n.RATE_LIMIT_MAX ?? 100),
};