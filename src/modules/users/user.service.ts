import { UserRepository } from "../../repositories/user.repository";
import { prisma } from "../../config/prisma"
import { AppError } from "../../errors/appError";


const userRepository = new UserRepository(prisma)

interface UpdateUserInput {
  email: string;
  password: string;
  name?: string;
}


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

  async getAll(page=1,limit=10) {
    const users = await userRepository.getAll({ page, limit })

    return users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
                updatedAt: user.updatedAt,
      }))

  }

  async deleteById(userId: string) {
    const user = await userRepository.findById(userId)

    if (!user) {
      throw new AppError(404,
        "USER_NOT_FOUND",
             "User not found"
      )
    }

    await userRepository.deleteById((userId))

    return {
      message:"User Deleted Successfully!"
    }
  }

  async updateById(userId: string ,data:UpdateUserInput) {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw new AppError(404,
        "USER_NOT_FOUND",
             "User not found"
      )
    }

    await userRepository.update(userId, data)

    return {
      message: "User Update Successfully",
      user: {
        id: user.id,
        email:user.email
      }
    }
  }
}
