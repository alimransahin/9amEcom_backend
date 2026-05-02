import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import AppError from "../../../errors/AppError";
import config from "../../config";

// 📝 Register
const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.registerUser(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "User registered successfully",
    data: result
  });
});

// 🔐 Login
const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: "strict"
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Login successful",
    data: {
      accessToken: result.accessToken,
      user: result.user
    }
  });
});

// 🔓 Logout
const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("refreshToken");

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Logout successful",
    data: null
  });
});

// 🔄 Refresh Token
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw new AppError(status.UNAUTHORIZED, "Refresh token missing");
  }

  const result = await AuthService.refreshToken(token);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Token refreshed",
    data: result
  });
});

// 📧 Forgot Password (OTP)
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError(status.BAD_REQUEST, "Email is required");
  }

  const result = await AuthService.forgotPassword(email);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: result.message,
    data: null
  });
});

// 🔁 Reset Password (OTP)
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, otp, password } = req.body;

  if (!email || !otp || !password) {
    throw new AppError(status.BAD_REQUEST, "Missing required fields");
  }

  await AuthService.resetPasswordWithOtp(email, otp, password);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Password reset successful",
    data: null
  });
});

// 🔐 Update Password (logged-in user)
const updatePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError(status.UNAUTHORIZED, "Unauthorized");
  }

  await AuthService.updatePassword(userId, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Password updated successfully",
    data: null
  });
});

export const AuthController = {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword
};