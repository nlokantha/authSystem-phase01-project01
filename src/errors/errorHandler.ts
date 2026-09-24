import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "./appError";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: error.flatten().fieldErrors,
      },
    });

    return;
  }

  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        error: {
          code: "RESOURCE_ALREADY_EXISTS",
          message: "A resource with this value already exists",
        },
      });

      return;
    }
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message:error.message
      }
    })
    return
  }


  console.error(error)

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message:"An unexpected error occurred"
    }
  })
};
