import type {RequestHandler,NextFunction, Request, Response} from "express"
import { AppError } from "../errors/appError"

type UserRole = "USER" | "ADMIN"


const VALID_ROLES = new Set<UserRole>(["USER", "ADMIN"])


export const authorize = (...allowedRoles: UserRole[]): RequestHandler => {
  if (allowedRoles.length === 0 || allowedRoles.some((role) => !VALID_ROLES.has(role))) {
    throw new Error("Invalid RBAC policy configuration")
  }

  return (req: Request, _res: Response, next: NextFunction) => {
    // Authentiocation must run befor authorization
    if (!req.user) {
       return next(new AppError(401, "UNAUTHORIZED",
                "Authentication required"))
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      return next(new AppError(403,"FORBIDDEN",
                "You do not have permission to perform this action"))
    }

    return next()
  }


}
