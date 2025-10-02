import { Request, Response, NextFunction } from "express";
import { prisma } from "..";
import { BadRequestException, UnAuthorizedException } from "../utils/app-error";
import { HTTPSTATUS } from "../config/http.config";
import logger from "../utils/logger";
import { asyncHandler } from "../middlewares/asyncHandler";
import { userSchema } from "../schema/user.schema";
import { ROLE } from "../../generated/prisma";
import { redisClient } from "../config/redis.config";


// Get a single user
export const getUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    if (!userId) {
        throw new BadRequestException("User ID is required");
    }

    const cachedUser = await redisClient.get(`user:${userId}`);
    if (cachedUser) {
        res.status(200).json({
            success: true,
            message: "user retrieved successfully",
            data: JSON.parse(cachedUser)
        });
        return;
    }
    const user = await prisma.user.findUnique({
        where: { id: userId },
        omit: {
            password: true
        }
    });

    if (!user) {
        throw new BadRequestException("User not found");
    }

    if (user) {
        await redisClient.set(`user:${userId}`, JSON.stringify(user), { expiration: { type: "EX", value: 3600 } })
        res.status(HTTPSTATUS.OK).json({
            success: true,
            message: "User retrieved successfully",
            data: user
        });
    }
})

// Update user
export const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    if (!userId) {
        throw new BadRequestException("User ID is required");
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new BadRequestException("User not found");
    }

    // check if user is authorized to user profile
    if (userId !== req.user.id) {
        throw new UnAuthorizedException("Unauthorized");
    }

    req.body = userSchema.parse(req.body)
    // Update user data
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: req.body
    });

    // Clear cache for this user data
    await redisClient.del(`user:${userId}`);

    // return updated user data
    res.status(HTTPSTATUS.OK).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser
    });
});

// Delete User 
export const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    if (!userId) {
        throw new BadRequestException("user ID is required");
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { id: userId as string }
    });

    if (!user) {
        logger.error("User Not Found")
        throw new BadRequestException("User not found");
    }

    if (userId !== req.user.id && req.user.role !== ROLE.ADMIN) {
        logger.error("Not Authorized to delete user")
        throw new UnAuthorizedException("Unauthorized");
    }

    // Delete user
    await prisma.user.delete({
        where: { id: userId }
    });

    await redisClient.del(`user:${userId}`);
    await redisClient.del('users');

    // return success message
    logger.info("User Deleted Successfully")
    res.status(HTTPSTATUS.OK).json({
        success: true,
        message: "User deleted successfully",
    });
});


// Get all users
export const getAllusers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const cachedusers = await redisClient.get(`users`)
    if (cachedusers) {
        res.status(200).json({
            success: true,
            message: "users retrieved successfully",
            data: JSON.parse(cachedusers)
        });
    }
    const users = await prisma.user.findMany({
        include: {
            profiles: {},
            applications: {},
            jobs: {}
        },

    });

    await redisClient.set(`users`, JSON.stringify(users), { expiration: { type: "EX", value: 3600 } })
    res.status(HTTPSTATUS.OK).json({
        success: true,
        message: "users retrieved successfully",
        data: users
    });

})





