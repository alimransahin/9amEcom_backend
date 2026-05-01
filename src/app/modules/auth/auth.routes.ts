import { Router } from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";

const router = Router();

/* ======================
   AUTH BASIC
====================== */
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);

/* ======================
   TOKEN MANAGEMENT
====================== */
router.post("/refresh-token", AuthController.refreshToken);

/* ======================
   PASSWORD MANAGEMENT (OTP BASED)
====================== */
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

/* ======================
   PROTECTED ROUTES
====================== */
router.post(
    "/update-password",
    auth("admin", "customer"),
    AuthController.updatePassword
);

export const AuthRoutes = router;