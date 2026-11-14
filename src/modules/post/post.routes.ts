import { Router } from "express";
import { authenticate } from "../../middlewares/auth.milleware";
import { postController } from "./post.controller";

const router = Router();

router.get(
  "/:id",
  authenticate,
  postController.getPost
);

router.post("/",authenticate,postController.createPost)

router.delete(
  "/:id",
  authenticate,
  postController.deletePost
);

export default router;
