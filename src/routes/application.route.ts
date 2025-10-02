import express from "express"
import { applyToJob, approveApplication, getJobApplications, getUserJobApplications, updateApplicationReviewStatus } from "../controllers/application"
import { authenticateUser } from "../middlewares/auth.middleware"
import roleMiddleware from "../middlewares/roleMiddleware"
import { ROLE } from "../../generated/prisma"

const router = express.Router()

router.post("/apply/:jobId", authenticateUser, applyToJob)
router.put("/:id/approve", authenticateUser, roleMiddleware([ROLE.CLIENT]), approveApplication)
router.put("/:id/update", authenticateUser, roleMiddleware([ROLE.CLIENT]), updateApplicationReviewStatus)
router.get("/", authenticateUser, getUserJobApplications)
router.get("/:jobId/applications", authenticateUser, roleMiddleware([ROLE.CLIENT]), getJobApplications)
export default router