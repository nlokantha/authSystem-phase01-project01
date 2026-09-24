import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middlewares/validation.middleware"
import {loginSchema, refreshSchema, registerSchema} from "./auth.validation"



const router = Router()


const controller = new AuthController()


router.post("/register", validate(registerSchema), controller.register.bind(controller))
router.post("/login", validate(loginSchema), controller.login.bind(controller))
router.post("/refresh",validate(refreshSchema),controller.refresh.bind(controller))
router.post("/logout",validate(refreshSchema),controller.logout.bind(controller))

export default router;
