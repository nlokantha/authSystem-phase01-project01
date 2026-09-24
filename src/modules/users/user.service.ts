import { UserRepository } from "../../repositories/user.repository";
import { prisma } from "../../config/prisma"
import { AppError } from "../../errors/appError";


const userRepository = new UserRepository(prisma)

export class UserService {
  async getMe(userId: string) {
    const user = await userRepository.findById(userId)

    if (!user) {
      throw new AppError(404,"USER_NOT_FOUND","User not found")
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt:user.updatedAt
    }
  }
}
