import { Express } from "express-serve-static-core"
import { User } from "../../generated/prisma"

declare global {
    namespace Express {
        interface Request {
            user: User
        }
    }
}