import { Prisma, PrismaClient } from "../../generated/prisma";


interface PaginationOptions{
  page: number
  limit:number
}

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

  async getAll({ page, limit }: PaginationOptions) {
    const skip = (page-1)*limit
    return this.prisma.user.findMany({
      skip, take: limit, orderBy: {
        createdAt:"desc"
      }
    })
  }

  async deleteById(id: string) {
    return this.prisma.user.delete({
      where: {
        id
      }
    })
  }

  async update(id:string,data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data
     })
  }
}
