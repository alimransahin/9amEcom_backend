import bcrypt from "bcrypt";
import crypto from "crypto";
import { User } from "../users/user.model";
import status from "http-status";
import config from "../../config";
import { createToken, verifyToken } from "../../utils/jwt";
import AppError from "../../../errors/AppError";

// -------------------- REGISTER --------------------
const registerUser = async (payload: any) => {
  const exists = await User.findOne({ email: payload.email });

  if (exists) {
    throw new AppError(status.BAD_REQUEST, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  return await User.create({
    ...payload,
    password: hashedPassword
  });
};

// -------------------- LOGIN --------------------
const loginUser = async (payload: any) => {
  const user = await User.findOne({ email: payload.email }).select("+password");

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  const match = await bcrypt.compare(payload.password, user.password);

  if (!match) {
    throw new AppError(status.UNAUTHORIZED, "Invalid credentials");
  }

  const jwtPayload = {
    userId: user._id,
    role: user.role
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret!,
    config.jwt_access_expires_in
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret!,
    config.jwt_refresh_expires_in
  );

  return { accessToken, refreshToken, user };
};

// -------------------- REFRESH TOKEN --------------------
const refreshToken = async (token: string) => {
  const decoded = verifyToken(token, config.jwt_refresh_secret!) as any;

  const newAccessToken = createToken(
    { userId: decoded.userId, role: decoded.role },
    config.jwt_access_secret!,
    config.jwt_access_expires_in
  );

  return { accessToken: newAccessToken };
};

// -------------------- FORGOT PASSWORD (OTP) --------------------
const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  user.resetOtp = hashedOtp;
  user.resetOtpExpire = new Date(Date.now() + 5 * 60 * 1000);

  await user.save();

  console.log("OTP:", otp); // replace with email service

  return { message: "OTP sent successfully" };
};

// -------------------- RESET PASSWORD (OTP ONLY) --------------------
const resetPasswordWithOtp = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  const isOtpValid =
    user.resetOtp === hashedOtp &&
    user.resetOtpExpire &&
    user.resetOtpExpire > new Date();

  if (!isOtpValid) {
    throw new AppError(400, "Invalid or expired OTP");
  }

  user.password = await bcrypt.hash(newPassword, 10);

  user.resetOtp = undefined;
  user.resetOtpExpire = undefined;

  await user.save();

  return null;
};

// -------------------- UPDATE PASSWORD --------------------
const updatePassword = async (userId: string, payload: any) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(payload.oldPassword, user.password);

  if (!isMatch) {
    throw new AppError(401, "Old password is incorrect");
  }

  user.password = await bcrypt.hash(payload.newPassword, 10);

  await user.save();

  return null;
};

export const AuthService = {
  registerUser,
  loginUser,
  refreshToken,
  forgotPassword,
  resetPasswordWithOtp,
  updatePassword
};