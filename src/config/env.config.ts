import { getEnv } from "../utils/get-env";


export const envConfig = () => ({
    PORT: getEnv("PORT", "5000"),
    NODE_ENV: getEnv("NODE_ENV", "development"),

    JWT: {
        SECRET: getEnv("JWT_SECRET", "jwt_secret"),
        REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET", "refresh_secret")
    },
    UPSTASH: {
        REDIS: {
            URL: getEnv("UPSTASH_REDIS_REST_URL", ""),
            TOKEN: getEnv("UPSTASH_REDIS_REST_TOKEN", ""),
        }
    },
    RABBITMQ: {
        URL: getEnv("RABBIT_URL", "amqp://user:password@localhost:5672/vhost")
    }
})

export const Env = envConfig()