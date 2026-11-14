import type { RequestHandler } from "express";
import { AppError } from "../errors/appError";
import type { Permission } from "../authorization/permissions";
import { permissionService } from "../authorization/permission.service";

export const requirePermission = (
  permission: Permission
): RequestHandler => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(
        new AppError(
          401,
          "UNAUTHORIZED",
          "Authentication required"
        )
      );
    }

    const allowed = permissionService.hasPermission(
      req.user.role,
      permission
    );

    if (!allowed) {
      return next(
        new AppError(
          403,
          "FORBIDDEN",
          "You do not have permission to perform this action"
        )
      );
    }

    return next();
  };
};
