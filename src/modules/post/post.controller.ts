import { Request, Response, NextFunction } from "express";
import { PostService } from "./post.service";
import { AppError } from "../../errors/appError";

const postService = new PostService();

export class PostController {

  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError(401, "UNAUTHORIZED", "Authentication required");
      }
      const post = await postService.createPost(req.user.id, req.body)

      res.status(201).json({
        success: true,
        data:post
      })
    } catch (error) {
      next(error);
    }
  }




  async getPost(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError(401, "UNAUTHORIZED", "Authentication required");
      }

      const post = await postService.getPost(
        req.params.id as string,
        req.user.id,
      );

      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllPost(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError(401, "UNAUTHORIZED", "Authentication required");
      }

      const posts = await postService.getMyPosts(req.user.id, {
        page: 1,
        limit: 10,
      });

      res.status(200).json({
        success: true,
        data: posts,
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError(401, "UNAUTHORIZED", "Authentication required");
      }

      const result = await postService.deletePost(
        req.params.id as string,
        req.user.id,
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const postController = new PostController();
