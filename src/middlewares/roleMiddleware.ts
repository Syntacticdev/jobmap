import { NextFunction, Request, Response } from "express"
import { ROLE } from "../../generated/prisma";
import { UnAuthorizedException } from "../utils/app-error";


const roleMiddleware = (allowedRoles: ROLE[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user?.role;
        if (!userRole) {
            throw new UnAuthorizedException('Access denied. No role provided.');
        }

        if (!allowedRoles.includes(userRole)) {
            throw new UnAuthorizedException('Access denied. Insufficient permissions.');
        }

        next();
    };
}

export default roleMiddleware