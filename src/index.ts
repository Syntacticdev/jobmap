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


const app = express();
export const prisma = new PrismaClient();
app.use(helmet());
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
});
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



app.set('trust proxy', true);

app.listen(Env.PORT, () => {
    console.log(`Server is running on port ${Env.PORT}`);
});