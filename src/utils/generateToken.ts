import jwt from "jsonwebtoken"
import { Response } from "express";
import { Env } from "../config/env.config";
import { prisma } from "..";

export type tokenProps = {
    userId: string,
    email: string
}

export const generateToken = async (data: tokenProps, res: Response) => {

    const accessToken = jwt.sign(data, Env.JWT.SECRET, { expiresIn: '20m' });
    const refreshToken = jwt.sign({ userId: data.userId, email: data.userId }, Env.JWT.REFRESH_SECRET, { expiresIn: '7d' });

    //    const expiresAt = new Date();
    // expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
    // Save new refresh token

    // res.cookie("jwt", accessToken, {
    //     maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    //     httpOnly: true, // prevent XSS attacks: cross-site scripting
    //     sameSite: "strict", // CSRF attacks
    //     secure: Env.NODE_ENV === "development" ? false : true,
    // });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false, // true in production (HTTPS)
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await prisma.refreshToken.create({
        data: {
            userId: data.userId,
            email: data.email,
            token: refreshToken,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }
    })

    return { accessToken }
}

