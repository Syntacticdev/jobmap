import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken"
import { Env } from "../config/env.config";
import { NotFoundException, UnAuthorizedException } from "../utils/app-error";
import { prisma } from "..";
import { HTTPSTATUS } from "../config/http.config";


export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    let token: any;
    const tokenWithBearer = req.headers.authorization
    if (!tokenWithBearer) {
        return res.status(HTTPSTATUS.UNAUTHORIZED).send({ auth: false, message: "No token provided." })
    }

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        token = tokenWithBearer.split(" ")[1]
    } else {
        return res.status(HTTPSTATUS.UNAUTHORIZED).send({ auth: false, message: "Invalid token provided." })
    }

    try {
        const payload: any = jwt.verify(token, Env.JWT.SECRET, (err: any, decoded: any) => {
            if (err) {
                throw new UnAuthorizedException('Invalid token provided');
            }
            return decoded;
        });

        const user = await prisma.user.findFirst({
            where: {
                id: payload.userId
            }
        })
        if (!user) {
            throw new NotFoundException('User not found');
        }
        req.user = user;
        next();
    } catch (error) {
        throw new UnAuthorizedException("User is not authorized")
    }
}