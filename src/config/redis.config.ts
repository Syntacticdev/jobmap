import { createClient } from "redis";
import logger from "../utils/logger";
import { Env } from "./env.config";

export const redisClient = createClient({
    url: Env.REDIS.URL
})

async function connectRedis() {
    try {
        await redisClient.connect();
        logger.info("Redis connected");
        return redisClient;
    } catch (error) {
        logger.error("Redis connection failed:", error);
        throw new Error("Failed to connect to Redis");
    }
}

export default connectRedis;