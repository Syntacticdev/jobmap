import express from "express"
import { createjob, deletejob, getAlljobs, getClientjobs, getjob, updatejob } from "../controllers/job.controller"
import { authenticateUser } from "../middlewares/auth.middleware"
import roleMiddleware from "../middlewares/roleMiddleware"
import { ROLE } from "../../generated/prisma"

const router = express.Router()

router.post("/", authenticateUser, roleMiddleware([ROLE.ADMIN, ROLE.CLIENT]), createjob)
router.put("/:id", authenticateUser, roleMiddleware([ROLE.ADMIN, ROLE.CLIENT]), updatejob)
router.get("/", getAlljobs)
router.get("/:id", getjob)
router.get('/client/jobs', authenticateUser, roleMiddleware([ROLE.CLIENT]), getClientjobs)
router.delete("/:id", authenticateUser, roleMiddleware([ROLE.ADMIN, ROLE.CLIENT]), deletejob)


export default router