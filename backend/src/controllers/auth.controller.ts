import { Request, Response } from 'express';
import * as auth from '../services/auth.service';

export const createUser = async (req: Request, res: Response) => {
    const created = await auth.createUser(req.body);
    res.status(201).json(created);
};

export const userLogin = async (req: Request, res: Response) => {
    const token = await auth.loginUser(req.body);
    res.status(200).json({ token });
};