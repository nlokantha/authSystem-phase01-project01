import { Router } from "express";
import { UserController } from "./user.controller";
import {authenticate} from "../../middlewares/auth.milleware"
import { authorize } from "../../middlewares/authorize.middleware";
import { requirePermission } from "../../middlewares/authorize-permission.middleware";
import { PERMISSIONS } from "../../authorization/permissions";

const router = Router()

const controller = new UserController()


router.get("/me", authenticate, controller.getMe.bind(controller))
// router.get("/all",authenticate,authorize("ADMIN"),controller.getAll.bind(controller))
router.get("/all",authenticate,requirePermission(PERMISSIONS.USERS_READ),controller.getAll.bind(controller))


export default router;
