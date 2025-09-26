import cron from "node-cron";
import { prisma } from "..";
import { expiredOldJobs, weeklyReport } from "../controllers/job.controller";


// Close Job that are 30 days old
// cron.schedule("0 0 * * *", async () => {
//     await prisma.job.updateMany({
//         where: {
//             status: "OPEN",
//             createdAt: {
//                 lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
//             }
//         },
//         data: {
//             status: "CLOSE"
//         }
//     })
// })


// Close Job that are 30 days old
cron.schedule("0 0 * * *", async () => {
    await expiredOldJobs();
});

// Send weekly summary report at 9 O'clock every monday 
cron.schedule("0 9 * * MON", async () => {
    // Logic to send weekly summary report
    await weeklyReport()
});