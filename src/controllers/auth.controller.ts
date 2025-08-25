import { Request, Response, NextFunction } from "express";
import emailService from "../services/email.service";
import { signupSchema } from "../schema/auth.schema";



export const login = (req: Request, res: Response, next: NextFunction) => {
    // Handle login logic
};
export const register = async (req: Request, res: Response, next: NextFunction) => {
    // Handle registration logic
    signupSchema.parse(req.body);
    await emailService.sendWelcomeEmail(req.body.email, req.body.name);
    res.status(201).json({ message: "User registered successfully" });
};