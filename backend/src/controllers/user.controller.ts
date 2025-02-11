import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from "bcryptjs";

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

export async function loginUser(req: Request, res:Response) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ message: "Invalid credentials" });
            return;
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        res.status(200).json({ message: "Logged in successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
