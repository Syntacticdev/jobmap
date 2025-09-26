// import { Redis } from "@upstash/redis";

// const redis = new Redis({
//     url: "UPSTASH_REDIS_REST_URL",
//     token: "UPSTASH_REDIS_REST_TOKEN",
// });

import { createClient } from "redis";

export const redisClient = createClient({})

async function connectRedis() {
    try {
        await redisClient.connect();
        console.log("✅ Redis connected");
        return redisClient;
    } catch (error) {
        console.error("❌ Redis connection failed:", error);
        throw new Error("Failed to connect to Redis");
    }
}

export default connectRedis;