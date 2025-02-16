import { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import User from '../models/user.model';
import { STATUS_CODES } from 'http';

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
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const authenticated = await user.comparePassword(password);
        
        if (!authenticated) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        
        const token = jwt.sign({ id: user._id }, String(process.env.ACCESS_TOKEN_SECRET), { expiresIn: "1h" });
        
        res.cookie("access-token", token, {
            httpOnly: true, // prevents XSS (cross-site scripting)
            secure: process.env.NODE_ENV === "prod", // use https only in production environment
            sameSite: "strict", // prevents CSRF (cross-site request forgery)
            maxAge: 60 * 60 * 1000, // 1 hour
        });
        
        res.status(200).json({ token, user: { name: user.name, email: user.email } });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export async function logoutUser(req: Request, res: Response) {
    try {
        res.clearCookie("access-token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "prod",
            sameSite: "strict"
        });
    
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}
