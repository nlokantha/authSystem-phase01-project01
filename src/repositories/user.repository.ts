import { Prisma, PrismaClient } from "../../generated/prisma";


export class UserRepository {
  constructor(
    private readonly prisma:PrismaClient
  ) { }

  async create(
     data: Prisma.UserCreateInput,
   ) {
     return this.prisma.user.create({
       data,
     });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email
      }
    })
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id
      }
    })
  }
}
