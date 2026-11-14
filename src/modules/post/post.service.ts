import { prisma } from "../../config/prisma";
import { AppError } from "../../errors/appError";
import { PostRepository } from "../../repositories/post.repository";

const postRepository = new PostRepository(prisma);

export class PostService {

  async createPost(
    userId: string,
    data: { title: string; content: string }
  ) {
    return postRepository.createOwned(userId, data);
  }

  async getPost(postId: string, userId: string) {
    const post = await postRepository.findOwnedById(
      postId,
      userId
    );

    if (!post) {
      throw new AppError(
        404,
        "POST_NOT_FOUND",
        "Post not found"
      );
    }

    return post;
  }

  async getMyPosts(
    userId: string,
    pagination: { page: number; limit: number }
  ) {
    return postRepository.findAllOwned(userId, pagination);
  }

  async updatePost(
    postId: string,
    userId: string,
    data: { title?: string; content?: string }
  ) {
    const result = await postRepository.updateOwnedById(
      postId,
      userId,
      data
    );

    if (result.count === 0) {
      throw new AppError(
        404,
        "POST_NOT_FOUND",
        "Post not found"
      );
    }

    // Return the updated record.
    const updatedPost = await postRepository.findOwnedById(
      postId,
      userId
    );

    if (!updatedPost) {
      throw new AppError(
        404,
        "POST_NOT_FOUND",
        "Post not found"
      );
    }

    return updatedPost;
  }

  async deletePost(postId: string, userId: string) {
    const result = await postRepository.deleteOwnedById(
      postId,
      userId
    );

    if (result.count === 0) {
      throw new AppError(
        404,
        "POST_NOT_FOUND",
        "Post not found"
      );
    }

    return {
      message: "Post deleted successfully",
    };
  }
}
