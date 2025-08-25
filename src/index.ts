import "./config/sentry.config"
import "dotenv/config"
import express, { Request, Response, NextFunction } from 'express';
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
import { sendPostNotification } from "./queues/producers/notification.producer";
import authRoutes from "./routes/auth.route"

const app = express();
export const prisma = new PrismaClient();
app.use(helmet());
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('trust proxy', true);


app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
});

// app.post("/post/create", async (req, res) => {
//     const { userId, title, body } = req.body
//     const payload = {
//         userId,
//         payload: {
//             title,
//             body
//         }
//     }
//     await sendPostNotification("post.create", payload);
//     res.status(201).json({ message: "Post created successfully" });
// })

app.use("/api/auth", authRoutes);

// First
app.use("/", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return res.status(HTTPSTATUS.OK).json({
        message: "Welcome to JobMap"
    })
}))

// Middle

// Last Hit
Sentry.setupExpressErrorHandler(app);
app.use(errorHandler);







(async () => {
    try {
        await setupQueues(); // Ensure all queues and exchanges are declared
        await connectRabbitMQ();
        await emailConsumer();
        await notificationConsumer();
        console.log("✅ RabbitMQ setup complete. Ready to process messages.");
    } catch (err) {
        console.error("❌ Error connecting to RabbitMQ:", err);
        // Optionally, exit the process if RabbitMQ is critical
        // process.exit(1);
    }
})();

app.listen(Env.PORT, () => {
    console.log(`Server is running on port ${Env.PORT}`);

});