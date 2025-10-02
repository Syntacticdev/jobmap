import "dotenv/config"
import { getEnv } from "../utils/get-env";


export const envConfig = () => ({
    PORT: getEnv("PORT"),
    NODE_ENV: getEnv("NODE_ENV"),
    DATABASE_URL: getEnv("DATABASE_URL"),

    JWT: {
        SECRET: getEnv("JWT_SECRET"),
        REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET")
    },

    REDIS: {
        URL: getEnv("REDIS_URL"),
    },

    RABBITMQ: {
        URL: getEnv("RABBIT_URL")
    },
    EMAIL: {
        USER: getEnv("EMAIL_USER"),
        PASS: getEnv("EMAIL_PASS")
    },
    SENTRY_DNS: getEnv("SENTRY_DNS")
})

export const Env = envConfig()