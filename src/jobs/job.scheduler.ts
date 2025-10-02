import cron from "node-cron";
import { prisma } from "..";
import { expiredOldJobs, weeklyReport } from "../controllers/job.controller";

// Close Job that are 30 days old
cron.schedule("0 0 * * *", async () => {
    await expiredOldJobs();
});

// Send weekly summary report at 9 O'clock every monday 
cron.schedule("0 9 * * MON", async () => {
    // Logic to send weekly summary report
    await weeklyReport()
});