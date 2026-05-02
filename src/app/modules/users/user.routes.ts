import { Router } from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { updateUserZodSchema } from "./user.validation";

const router = Router();

router.get("/", auth("admin"), UserController.getAllUsers);
router.get("/me", auth("admin", "customer"), UserController.getMe);
router.get("/:id", auth("admin", "customer"), UserController.getSingleUser);
router.patch("/:id", validateRequest(updateUserZodSchema), auth("admin", "customer"), UserController.updateUser);
router.delete("/:id", auth("admin"), UserController.deleteUser);

export const UserRoutes = router;