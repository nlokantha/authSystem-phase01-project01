import { Request, Response } from "express";
import { UserService } from "./user.service";
import { AppError } from "../../errors/appError";



const userService = new UserService()


export class UserController {
  async getMe(req: Request, res:Response): Promise<void>{
    if (!req.user) {
      throw new AppError(401,"UNAUTHORIZED","Authentication required")
    }

    const user = await userService.getMe(req.user.id)

    res.status(200).json({
      success: true,
      data:user
    })
  }
}
