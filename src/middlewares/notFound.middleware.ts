import { Request, Response } from "express";
import { AppError } from "../errors/appError";



export const notFoundHandler = (req: Request, _res: Response): never => {
  throw new AppError(404,"ROUTE_NOT_FOUND",`Route ${req.method} ${req.originalUrl} not found` )
}
