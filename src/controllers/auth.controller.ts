import { Request, Response, NextFunction } from "express";
import { loginSchema, signupSchema } from "../schema/auth.schema";
import { prisma } from "..";
import { BadRequestException, UnAuthorizedException } from "../utils/app-error";
import jwt from "jsonwebtoken"
import { Env } from "../config/env.config";
import { generateToken, tokenProps } from "../utils/generateToken";
import { HTTPSTATUS } from "../config/http.config";
import { hashSync, compareSync } from "bcryptjs"
import logger from "../utils/logger";
import { asyncHandler } from "../middlewares/asyncHandler";
import { sendEmailNotificationQueue } from "../queues/producers/email.producer";
import { generateOtp, hashOtp } from "../utils/generate-otp";
import { OTP_PURPOSE } from "../../generated/prisma";

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    logger.info("Registration endpoint hits..")
    signupSchema.parse(req.body);
    let user = await prisma.user.findFirst({
        where: {
            email: req.body.email
        }
    })
    if (user) {
        logger.warn("User with email already exists")
        throw new BadRequestException("User with email already exist")
    }
    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 mins
    user = await prisma.user.create({
        data: {
            email: req.body.email,
            password: hashSync(req.body.password, 10), // Hashing the password before saving
            otpHash,
            otpExpiresAt,
            otpPurpose: OTP_PURPOSE.ACCOUNT_VERIFICATION
        }
    })
    logger.info("User successfully created")
    await sendEmailNotificationQueue("email.auth_code", { to: user.email, otp, expirationMinutes: 10 });

    res.status(201).json({
        success: true,
        message: "User successfully created",
        data: {
            user: {
                id: user.id,
                email: user.email
            }
        }
    })

})

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    logger.info("Login endpoint hits..")
    req.body = loginSchema.parse(req.body);
    let user = await prisma.user.findFirst({
        where: {
            email: req.body.email
        }
    })
    if (!user) {
        logger.warn("User with email does not exist")
        throw new BadRequestException("User with email does not exist")
    }
    const isPasswordValid = compareSync(req.body.password, user.password)
    if (!isPasswordValid) {
        logger.warn("Invalid password")
        throw new BadRequestException("Invalid password")
    }
    logger.info("User successfully logged in")
    const { accessToken } = await generateToken({ userId: user.id, email: user.email }, res)
    res.status(HTTPSTATUS.OK).json({
        success: true,
        message: "User successfully logged in",
        token: accessToken,
        data: {
            user: {
                id: user.id,
                email: user.email
            }
        }
    })

});

export const requestOtp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, otpPurpose } = req.body;
    const eventType = otpPurpose == OTP_PURPOSE.ACCOUNT_VERIFICATION ? "email.auth_code" : "email.password_reset"
    if (!email) {
        throw new BadRequestException("Email is required");
    }
    console.log(eventType)
    const user = await prisma.user.findFirst({
        where: {
            email
        }
    });
    if (!user) {
        throw new BadRequestException("User with this email does not exist");
    }

    // Generate OTP and hash
    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 mins

    await prisma.user.update({
        where: { id: user.id },
        data: {
            otpHash,
            otpPurpose: otpPurpose ? otpPurpose : OTP_PURPOSE.PASSWORD_RESET,
            otpExpiresAt,
            otpUsed: false
        }
    })

    await sendEmailNotificationQueue(eventType, { to: user.email, otp, expirationMinutes: 10 });

    res.status(HTTPSTATUS.OK).json({ message: "OTP sent to email" });
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp, otpPurpose } = req.body;

    if (!email || !otp || !otpPurpose) {
        throw new BadRequestException("Email and OTP are required");
    }

    const user = await prisma.user.findFirst({
        where: {
            email
        }
    });
    if (!user) {
        throw new BadRequestException("User with this email does not exist");
    }

    const hashedOtp = hashOtp(otp);

    if (!user.otpHash || user.otpHash !== hashedOtp ||
        user.otpPurpose !== otpPurpose || !user.otpExpiresAt ||
        user.otpExpiresAt < new Date() || user.otpUsed
    ) {
        throw new UnAuthorizedException("Invalid or expired OTP")
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { otpUsed: true },
    });

    if (otpPurpose === "ACCOUNT_VERIFICATION") {
        await prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true },
        });
        await sendEmailNotificationQueue("email.welcome", { to: user.email, name: user.email });
    }


    res.status(HTTPSTATUS.OK).json({ message: "OTP verified successfully" });
});

export const verifyAccount = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new BadRequestException("Email and OTP are required");
    }

    const user = await prisma.user.findFirst({
        where: {
            email
        }
    });
    if (!user) {
        throw new BadRequestException("User with this email does not exist");
    }

    const hashedOtp = hashOtp(otp);

    if (
        !user.otpHash ||
        user.otpHash !== hashedOtp ||
        user.otpPurpose !== OTP_PURPOSE.ACCOUNT_VERIFICATION ||
        !user.otpExpiresAt ||
        user.otpExpiresAt < new Date() ||
        user.otpUsed
    ) {
        throw new UnAuthorizedException("Invalid or expired OTP")
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { otpUsed: true },
    });

    await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
    });
    await sendEmailNotificationQueue("email.welcome", { to: user.email, name: user.email });

    res.status(HTTPSTATUS.OK).json({ message: "Account verified successfully" });
})

export const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { email, newPassword, otp } = req.body;

    if (!email || !newPassword || !otp) {
        throw new BadRequestException("All Field is Required *")
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException("User no found")

    const hashedOtp = hashOtp(otp);

    if (
        !user.otpHash ||
        user.otpHash !== hashedOtp ||
        user.otpPurpose !== OTP_PURPOSE.PASSWORD_RESET ||
        !user.otpExpiresAt ||
        user.otpExpiresAt < new Date() ||
        user.otpUsed
    ) {
        throw new UnAuthorizedException("Invalid or expired OTP ")
    }

    const hashedPassword = hashSync(newPassword, 10)

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            otpUsed: true,
        },
    });

    res.status(HTTPSTATUS.OK).json({ message: "Password reset successfully" });
})

export const refresh = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // const oldRefreshToken = req.body.refreshToken;
    // if (!oldRefreshToken) return res.status(401).json({ message: 'No refresh token' });
    const oldRefreshToken = req.cookies['refreshToken']
    if (!oldRefreshToken) return res.status(401).json({ message: 'No refresh token' });

    const storedToken = await prisma.refreshToken.findFirst({
        where: {
            token: oldRefreshToken
        }
    })
    if (!storedToken) throw new UnAuthorizedException("Invalid refresh token")

    // Check if token is expired and Remove from the database
    if (storedToken && storedToken.expires < new Date()) {
        await prisma.refreshToken.delete({
            where: {
                token: oldRefreshToken
            }
        })
        throw new UnAuthorizedException("Token has expired")
    }

    const decoded = jwt.verify(oldRefreshToken, Env.JWT.REFRESH_SECRET);
    if (typeof decoded !== 'object' || !('userId' in decoded)) {
        throw new UnAuthorizedException("Invalid token payload");
    }
    const tokenData = decoded as tokenProps;

    const user = await prisma.user.findFirst({
        where: {
            id: tokenData?.userId
        }
    })
    if (!user) throw new UnAuthorizedException("Invalid token")

    // Generate new tokens
    const { accessToken } = await generateToken({ userId: tokenData.userId, email: tokenData.email }, res)
    // Revoke old refresh token
    await prisma.refreshToken.delete({ where: { token: oldRefreshToken } })

    res.json({ accessToken, message: "Token successfully refreshed" });
})

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        await prisma.refreshToken.delete({ where: { token: refreshToken } })
        res.clearCookie('refreshToken');
    }
    res.json({ message: 'Logged out' });
};

