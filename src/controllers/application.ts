import { Request, Response, NextFunction } from "express";
import { prisma } from "..";
import { BadRequestException, UnAuthorizedException } from "../utils/app-error";
import { HTTPSTATUS } from "../config/http.config";
import logger from "../utils/logger";
import { asyncHandler } from "../middlewares/asyncHandler";
import { APP_STATUS, Job, ROLE, STATUS } from "../../generated/prisma";
import { redisClient } from "../config/redis.config";
import { ApplicationSchema } from "../schema/application.schema";
import { sendEmailNotificationQueue } from "../queues/producers/email.producer";


// Apply To Job
export const applyToJob = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    ApplicationSchema.parse(req.body);
    const { cv, coverLetter } = req.body

    const jobId = req.params.jobId;
    if (!jobId) {
        throw new BadRequestException("Job ID is required");
    }

    const job = await prisma.job.findUnique({
        where: { id: jobId }
    })

    if (!job) {
        throw new BadRequestException("Job Not Found")
    }

    const applicationData = await prisma.application.create({
        data: {
            jobId: jobId,
            userId: req.user.id,
            cv,
            coverLetter
        }
    })

    // await notifyUserWhoFollowedAuthorOnNewjob(req.user.id, req.body.title)
    // await notifyUserWhoFollowedAuthorOnNewjobQueue(req.user.id, req.body.title)

    res.status(HTTPSTATUS.CREATED).json({
        success: true,
        message: "Job Applied successfully",
        // data: applicationData
    })

})

// Approve Job Application and Close the Job
export const approveApplication = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const applicationId = req.params.id;

    if (!applicationId) {
        throw new BadRequestException("Application ID is required");
    }

    const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: {
            job: {
                include: {
                    client: {
                        select: {
                            email: true,
                            name: true
                        }
                    },
                },
            },
            user: {},

        }
    });

    // Check if job exists
    if (!application) {
        throw new BadRequestException("Application not found");
    }
    // check if user is authorized to update/approve the job Application
    if (application?.job.clientId !== req.user.id) {
        throw new BadRequestException("Unauthorized");
    }

    // Approved and Close the Job
    const [updatedApplication, closedJob] = await prisma.$transaction([
        prisma.application.update({
            data: {
                status: APP_STATUS.APPROVED
            },
            where: {
                id: applicationId,
            }
        }),
        prisma.application.updateMany({
            data: {
                status: APP_STATUS.CLOSED
            },
            where: {
                jobId: application.jobId,
                NOT: {
                    userId: application.userId
                }
            }
        }),
        prisma.job.update({
            where: { id: application.jobId },
            data: {
                status: STATUS.CLOSE
            }
        })
    ])
    // Send Approval Email Notification To Picked/Selected User
    await sendEmailNotificationQueue("email.job_approval", { email: application.user.email, jobTitle: application.job.title, clientName: application.job.client.name })

    // Clear cache for this job, 
    await redisClient.del(`applications:${applicationId}`);
    await redisClient.del(`job:${application.jobId}`);

    // return updated job data
    res.status(HTTPSTATUS.OK).json({
        success: true,
        message: "Job Application approved",
        data: updatedApplication
    });
});

// Update Job Application Review State
export const updateApplicationReviewStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const applicationId = req.params.id;
    const app_status = req.body.status

    if (!applicationId) {
        throw new BadRequestException("Application ID is required");
    }

    const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: {
            job: {}
        }
    });

    // Check if job exists
    if (!application) {
        throw new BadRequestException("Application not found");
    }
    // check if user is authorized to update the job
    if (application?.job.clientId !== req.user.id) {
        throw new BadRequestException("Unauthorized");
    }

    // Update Application Status
    const updatedApplication = await prisma.application.update({
        data: {
            status: app_status
        },
        where: {
            id: applicationId,
        }
    });

    // Clear cache for this job and all jobs
    await redisClient.del(`applications:${applicationId}`);
    await redisClient.del('applications');

    // return updated job data
    res.status(HTTPSTATUS.OK).json({
        success: true,
        message: "Application Placed Status Updated",
        data: updatedApplication
    });
});

// Get User Applications
export const getUserJobApplications = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;

    const userCachedApplications = await redisClient.get(`user:${userId}:applications`);
    if (userCachedApplications) {
        res.status(200).json({
            success: true,
            message: "User Job Application Retrieved Successfully",
            data: JSON.parse(userCachedApplications)
        });
        return;
    }
    const userApplications = await prisma.application.findMany({
        where: {
            userId
        }
    })

    if (userApplications) {
        await redisClient.set(`user:${userId}:applications`, JSON.stringify(userApplications), { expiration: { type: "EX", value: 3600 } })
        res.status(HTTPSTATUS.OK).json({
            success: true,
            message: "job retrieved successfully",
            data: userApplications
        });
    }

})

// Client -> Get Applications Under Each Job
export const getJobApplications = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const jobId = req.params.jobId;

    if (!jobId) {
        throw new BadRequestException("Job ID is required");
    }

    const job = await prisma.job.findUnique({
        where: { id: jobId },
    })

    // check if user is authorized to View the job Applications
    if (job?.clientId !== req.user.id) {
        throw new BadRequestException("Unauthorized");
    }

    const applications = await prisma.application.findMany({
        where: { jobId },
        include: {
            user: {
                select: {
                    id: true,
                    email: true
                }
            }
        }
    });

    // return updated job data
    res.status(HTTPSTATUS.OK).json({
        success: true,
        message: "Application Retrieved Successfully",
        data: applications
    });

})



