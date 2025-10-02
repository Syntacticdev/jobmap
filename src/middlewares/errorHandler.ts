import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AppError } from "../utils/app-error";
import { HTTPSTATUS } from "../config/http.config";
import { ZodError } from "zod"
import { Prisma, PrismaClient } from "@prisma/client"


export const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        console.log(err)
        res.status(err.statusCode).json({
            message: err.message
        });
    }

    // ZodError from Zod
    if (err instanceof ZodError) {
        res.status(HTTPSTATUS.BAD_REQUEST).json({
            message: "Validation Error",
            errors: err.issues.map(issue => ({
                field: issue.path.join("."),
                message: issue.message
            }))
        });
    }
};