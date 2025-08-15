import { Router } from 'express';
import { inquiryRoute } from './inquiry.routes';
import { authRoute } from './auth.routes';

export const routes = Router();

routes.get('/health', (_req, res) => res.json({ ok: true }));
routes.use('/inquiries', inquiryRoute);
routes.use('/auth', authRoute);

