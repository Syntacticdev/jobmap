import { Request, Response, NextFunction } from "express";
import { prisma } from "..";
import { BadRequestException, UnAuthorizedException } from "../utils/app-error";
import { HTTPSTATUS } from "../config/http.config";
import logger from "../utils/logger";
import { asyncHandler } from "../middlewares/asyncHandler";
import { jobSchema } from "../schema/job.schema";
import { Job, ROLE, STATUS } from "../../generated/prisma";
import { redisClient } from "../config/redis.config";


// create job
export const createjob = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    jobSchema.parse(req.body);
    const { title, description, offerMin, offerMax } = req.body
    const jobData = await prisma.job.create({
        data: {
            title,
            description,
            offerMin: Number(offerMin),
            offerMax: Number(offerMax),
            clientId: req.user.id,
            role: "Developer"
        }
    })

    // await notifyUserWhoFollowedAuthorOnNewjob(req.user.id, req.body.title)
    // await notifyUserWhoFollowedAuthorOnNewjobQueue(req.user.id, req.body.title)

    res.status(HTTPSTATUS.CREATED).json({
        success: true,
        message: "job created successfully",
        // data: jobData
    })

})

// update job
export const updatejob = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const jobId = req.params.id;

    if (!jobId) {
        throw new BadRequestException("Job ID is required");
    }

    const job: Job | null = await prisma.job.findUnique({
        where: { id: jobId as string }
    });

    // Check if job exists
    if (!job) {
        throw new BadRequestException("Job not found");
    }
    // check if user is authorized to update the job
    if (job?.clientId !== req.user.id) {
        throw new BadRequestException("Unauthorized");
    }

    // Update job data
    const updatedjob = await prisma.job.update({
        where: { id: jobId as string },
        data: req.body
    });

    // Clear cache for this job and all jobs
    await redisClient.del(`job:${jobId}`);
    await redisClient.del('jobs');

    // return updated job data
    res.status(HTTPSTATUS.OK).json({
        success: true,
        message: "job updated successfully",
        data: updatedjob
    });
});

// delete job
export const deletejob = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const jobId = req.params.id;
    if (!jobId) {
        throw new BadRequestException("Job ID is required");
    }

    // Check if job exists
    const job = await prisma.job.findUnique({
        where: { id: jobId as string }
    });

    if (!job) {
        logger.error("job Not Found")
        throw new BadRequestException("job not found");
    }

    if (job?.clientId !== req.user.id && req.user.role !== ROLE.ADMIN) {
        logger.error("Not Authorized to delete job")
        throw new BadRequestException("Unauthorized");
    }

    // Delete job
    await prisma.job.delete({
        where: { id: jobId }
    });

    // Clear cache for this job and all jobs
    await redisClient.del(`job:${jobId}`);
    await redisClient.del('jobs');

    // return success message
    logger.info("job Deleted Successfully")
    res.status(HTTPSTATUS.OK).json({
        success: true,
        message: "job deleted successfully",
    });
});

// get job
export const getjob = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const jobId = req.params.id;

    if (!jobId) {
        throw new BadRequestException("Job ID is required");
    }

    const cachedjob = await redisClient.get(`job:${jobId}`);
    if (cachedjob) {
        res.status(200).json({
            success: true,
            message: "job retrieved successfully",
            data: JSON.parse(cachedjob)
        });
        return;
    }
    const job = await prisma.job.findUnique({
        where: { id: jobId as string },
    });

    if (job) {
        await redisClient.set(`job:${jobId}`, JSON.stringify(job), { expiration: { type: "EX", value: 3600 } })
        res.status(HTTPSTATUS.OK).json({
            success: true,
            message: "job retrieved successfully",
            data: job
        });
    }
    else {
        throw new BadRequestException("job not found");
    }
})

// get all jobs
export const getAlljobs = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const cachedjobs = await redisClient.get(`jobs`)
    if (cachedjobs) {
        res.status(200).json({
            success: true,
            message: "jobs retrieved successfully",
            data: JSON.parse(cachedjobs)
        });
    }
    const jobs = await prisma.job.findMany({
        include: {
            client: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });

    await redisClient.set(`jobs`, JSON.stringify(jobs), { expiration: { type: "EX", value: 3600 } })
    res.status(HTTPSTATUS.OK).json({
        success: true,
        message: "jobs retrieved successfully",
        data: jobs
    });

})


export const getClientjobs = async (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.user.id
    const cachedjobs = await redisClient.get(`${clientId}:jobs`)

    if (cachedjobs) {
        res.status(200).json({
            success: true,
            message: "jobs retrieved successfully",
            data: JSON.parse(cachedjobs)
        });
    }
    const jobs = await prisma.job.findMany({
        where: {
            clientId
        },
    })

    await redisClient.set(`${clientId}:jobs`, JSON.stringify(jobs), { expiration: { type: "EX", value: 3600 } })

    res.status(200).json({
        success: true,
        message: "jobs retrieved successfully",
        jobs
    })

}


export const expiredOldJobs = async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await prisma.job.updateMany({
        where: {
            createdAt: { lt: thirtyDaysAgo },
            status: STATUS.OPEN
        },
        data: {
            status: STATUS.CLOSE
        }
    })

    console.log(`Closed ${result.count} old jobs`);
};

export const weeklyReport = async () => {
    const clients = await prisma.user.findMany({
        where: {
            role: ROLE.CLIENT
        },
        select: {
            jobs: {
                where: {
                    status: STATUS.OPEN
                },
                select: { id: true, title: true, createdAt: true, status: true }
            }
        }
    })

    for (const client of clients) {
        // await notificationQueue.add("weeklySummary", {
        //   clientEmail: client.email,
        //   jobs: client.jobs
        // });
    }

    console.log(`Weekly summary queued for ${clients.length} clients`);
}

