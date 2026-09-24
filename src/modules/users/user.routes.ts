import { Router } from "express";
import { UserController } from "./user.controller";
import {authenticate} from "../../middlewares/auth.milleware"



const router = Router()


const controller = new UserController()


router.get("/me", authenticate, controller.getMe.bind(controller))


export default router;
