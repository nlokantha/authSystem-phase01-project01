import { NextFunction, Request, RequestHandler, Response } from "express";
import { AppError } from "../errors/appError";
import { UserRole } from "../types/roles";


export const authorizeUserAccess: RequestHandler = (req:Request,_res:Response,next:NextFunction) => {
  if (!req.user) {
    return next(new AppError(401,"UNAUTHORIZED","Authentication required"))
  }

  const targetUserId = req.params.id
  if (!targetUserId) {
    return next(new AppError(400,"INVALID_USER_ID","User ID is required"))
  }

  // Admin have access under our chose policy
  if (req.user.role === UserRole.ADMIN) {
    return next()
  }

  // Regular users can only access their own profile
  if (req.user.id !== targetUserId) {
    return next(new AppError(404,"USER_NOT_FOUND","User not found"))
  }



  return next()

}
