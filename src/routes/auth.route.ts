import express from "express"
import { login, refresh, register, requestOtp, resetPassword, verifyAccount, verifyOtp } from "../controllers/auth.controller"
import { rateLimitMiddleware } from "../middlewares/rateLimit"

const router = express.Router()

router.post("/login", login)
router.post("/register", register)
router.post("/verify-account", verifyAccount)
router.post("/refresh", refresh)
router.post('/request-otp', rateLimitMiddleware({ limit: 1, minute: 10 }), requestOtp)
router.post('/verify-otp', verifyOtp)
router.post("/reset-password", rateLimitMiddleware({ limit: 1, minute: 1440 }), resetPassword) // Password can be reset every 24hrs

export default router