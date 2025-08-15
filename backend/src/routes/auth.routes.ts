import { Router } from 'express';
//import { postInquiry, getInquiries } from '../controllers/inquiry.controller';
import { validate } from '../middleware/validate';
import { createUserLoginSchema, createUserRegistrationSchema } from '../schemas/auth.schema';
import { createUser, userLogin } from '../controllers/auth.controller';

export const authRoute = Router();

authRoute.post('/register', validate(createUserRegistrationSchema), createUser);
authRoute.post('/login', validate(createUserLoginSchema), userLogin);
