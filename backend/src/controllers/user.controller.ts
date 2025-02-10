import { Request, Response } from 'express';
import User from '../models/user.model';

export async function registerUser(req: Request, res: Response) {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        await User.create({ name, email, password });
        res.status(201).json({ message: "User registered successfully" });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
