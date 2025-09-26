import express from "express"
import { authenticateUser } from "../middlewares/auth.middleware"
import roleMiddleware from "../middlewares/roleMiddleware"
import { ROLE } from "../../generated/prisma"
import { deleteUser, getAllusers, getUser, updateUser } from "../controllers/user.controller"

const router = express.Router()

router.get("/", authenticateUser, roleMiddleware([ROLE.ADMIN]), getAllusers)
router.get("/:id", getUser)
router.put("/", authenticateUser, updateUser)
router.delete("/:id", authenticateUser, deleteUser)


export default router