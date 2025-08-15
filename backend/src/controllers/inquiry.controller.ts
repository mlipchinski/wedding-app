import { Request, Response } from 'express';
import * as inquiry from '../services/inquiry.service';

export const postInquiry = async (req: Request, res: Response) => {
    const created = await inquiry.createInquiry(req.body);
    res.status(201).json(created);
}

export const getInquiries = async (_req: Request, res: Response) => {
    const items = await inquiry.listInquiries();
    res.json(items);
}
