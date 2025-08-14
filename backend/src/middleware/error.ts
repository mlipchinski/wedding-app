import { Request, Response, NextFunction } from 'express';

const notFound = (_req: Request, res: Response) =>{
    res.status(404).json({ error: 'NotFound' });
}

const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error(err);
    }
    res.status(500).json({ error: 'InternalServerError' });
}

export const error = [
    notFound,
    errorHandler
];
