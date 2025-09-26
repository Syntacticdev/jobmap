import rateLimit from "express-rate-limit";


export function rateLimitMiddleware({ limit, minute }: { limit: number, minute: number }) {
    return rateLimit({
        windowMs: minute * 60 * 1000, // 15 minutes
        max: limit, // limit each IP to 5 OTP requests per windowMs
        message: "Too many OTP requests from this IP, please try again later.",
        standardHeaders: true,
        legacyHeaders: false,
    });
}