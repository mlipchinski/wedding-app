import { Request, Response } from 'express';
import * as auth from '../services/auth.service';

export const createUser = async (req: Request, res: Response) => {
    const created = await auth.createUser(req.body);

    if (!created) {
        return res.status(400).json({ error: 'User creation failed' });
    }

    await auth.sendVerificationEmail(created);

    return res.status(201).json({ message: 'User created successfully, verification email sent' });
};

export const userLogin = async (req: Request, res: Response) => {
    const token = await auth.loginUser(req.body);
    res.status(200).json({ token });
};

export const userVerifyEmail = async (req: Request, res: Response) => {
    const userID = parseInt(req.params.userID, 10);
    if (isNaN(userID)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        const updatedUser = await auth.verifyEmail(userID);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}