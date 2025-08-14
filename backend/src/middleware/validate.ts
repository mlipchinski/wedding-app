import { ZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate =
    (schema: ZodObject) =>
        (req: Request, res: Response, next: NextFunction) => {
            const result = schema.safeParse({
                body: req.body,
                query: req.query,
                params: req.params
            });
            if (!result.success) {
                return res.status(400).json({
                    error: 'ValidationError',
                    details: result.error.flatten()
                });
            }
            next();
        };
