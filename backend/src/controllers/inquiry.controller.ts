import { Request, Response } from 'express';
import * as svc from '../services/inquiry.service';

export async function postInquiry(req: Request, res: Response) {
    const created = await svc.createInquiry(req.body);
    res.status(201).json(created);
}

export async function getInquiries(_req: Request, res: Response) {
    const items = await svc.listInquiries();
    res.json(items);
}
