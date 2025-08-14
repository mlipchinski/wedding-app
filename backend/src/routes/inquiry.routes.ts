import { Router } from 'express';
import { postInquiry, getInquiries } from '../controllers/inquiry.controller';
import { validate } from '../middleware/validate';
import { createInquirySchema } from '../schemas/inquiry.schema';

export const inquiryRoute = Router();

inquiryRoute.post('/', validate(createInquirySchema), postInquiry);
// Later protect this route with auth middleware
inquiryRoute.get('/', getInquiries);
