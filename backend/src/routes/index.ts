import { Router } from 'express';
import { inquiryRoute } from './inquiry.routes';

export const routes = Router();

routes.get('/health', (_req, res) => res.json({ ok: true }));
routes.use('/inquiries', inquiryRoute);

