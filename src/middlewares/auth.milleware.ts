import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/appError";
import { AccessTokenPayload, verifyAccessToken } from "../utils/jwt";

export interface AuthenticatedRequest
  extends Request {
  user: {
    id: string;
    role: string;
  };
}

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authorization = req.headers.authorization

  if (!authorization) {
    throw new AppError(401,"UNAUTHORIZED","Authentication required",)
  }

  const [scheme, token] = authorization.split(" ")

  if (scheme !== "Bearer" || !token) {
    throw new AppError(
         401,
         "INVALID_AUTHORIZATION_HEADER",
         "Invalid authorization header",
       );
  }

  let payload: AccessTokenPayload

  try {
    payload = verifyAccessToken(token)
  } catch {
    throw new AppError(
          401,
          "INVALID_ACCESS_TOKEN",
          "Invalid or expired access token",
        );
  }

  if (payload.type !== "access") {
    throw new AppError(
          401,
          "INVALID_ACCESS_TOKEN",
          "Invalid access token",
        );
  }

  // (req as AuthenticatedRequest).user = {
  //   id: payload.sub,
  //   role:payload.role
  // }

  req.user = {
    id: payload.sub,
    role: payload.role,
  };
  next()
}
