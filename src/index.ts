import "./config/sentry.config"
import express, { Request, Response, NextFunction, application } from 'express';
import helmet from 'helmet';
import * as Sentry from "@sentry/node"
import cors from "cors"
import { errorHandler } from "./middlewares/errorHandler";
import { asyncHandler } from "./middlewares/asyncHandler";
import { HTTPSTATUS } from "./config/http.config";
import { Env } from "./config/env.config";
import { PrismaClient } from "../generated/prisma"
import { setupQueues } from "./queues/queueManager";
import connectRabbitMQ from "./config/rabbitmq.config";
import { emailConsumer } from "./queues/consumers/email.consumer";
import { notificationConsumer } from "./queues/consumers/notification.consumer";
import authRoutes from "./routes/auth.route"
import jobRoutes from "./routes/job.route"
import userRoutes from "./routes/user.route"
import applicationRoute from "./routes/application.route"
import connectRedis from "./config/redis.config";
import cookieParser from "cookie-parser";

const PORT = Env.PORT || 3000
const app = express();
export const prisma = new PrismaClient();
app.use(helmet());
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('trust proxy', true);


app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes)
app.use("/api/applications", applicationRoute)

// First
app.use("/", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return res.status(HTTPSTATUS.OK).json({
        message: "Welcome to JobMap"
    })
}))

Sentry.setupExpressErrorHandler(app);
app.use(errorHandler);

(async () => {
    try {
        await setupQueues(); // Ensure all queues and exchanges are declared
        await connectRabbitMQ();
        await emailConsumer();
        await notificationConsumer();
        console.log("RabbitMQ setup complete. Ready to process messages.");
    } catch (err) {
        console.error("Error connecting to RabbitMQ:", err);
        process.exit(1);
    }
})();

connectRedis();

app.listen(PORT, () => {
    console.log(`Server is running on port ${Env.PORT}`);

});