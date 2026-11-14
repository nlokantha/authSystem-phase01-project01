import { Prisma, PrismaClient } from "../../generated/prisma";

interface PaginationOptions {
  page: number;
  limit: number;
}

type CreatePostData = Pick<
  Prisma.PostCreateInput,
  "title" | "content"
>;

type UpdatePostData = Pick<
  Prisma.PostUpdateManyMutationInput,
  "title" | "content"
>;

export class PostRepository {
  constructor(
    private readonly prisma: PrismaClient
  ) {}

  // Create a post owned by the authenticated user
  async createOwned(userId: string, data: CreatePostData) {
    return this.prisma.post.create({
      data: {
        ...data,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  // Find a post only if the user owns it
  async findOwnedById(postId: string, userId: string) {
    return this.prisma.post.findFirst({
      where: {
        id: postId,
        userId,
      },
    });
  }

  // Find all posts belonging to a user
  async findAllOwned(userId: string, { page, limit }: PaginationOptions) {
    const skip = (page - 1) * limit;

    return this.prisma.post.findMany({
      where: {
        userId,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Update a post only if the user owns it
  async updateOwnedById(
    postId: string,
    userId: string,
    data: UpdatePostData
  ) {
    return this.prisma.post.updateMany({
      where: {
        id: postId,
        userId,
      },
      data,
    });
  }

  // Delete a post only if the user owns it
  async deleteOwnedById(postId: string, userId: string) {
    return this.prisma.post.deleteMany({
      where: {
        id: postId,
        userId,
      },
    });
  }
}
