import bcrypt from "bcrypt";
import { User } from "../users/user.model";
import status from "http-status";
import config from "../../config";
import { createToken, verifyToken } from "../../utils/jwt";
import AppError from "../../middlewares/AppError";

const registerUser = async (payload: any) => {
  const exists = await User.findOne({ email: payload.email });

  if (exists) {
    throw new AppError(status.BAD_REQUEST, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await User.create({
    ...payload,
    password: hashedPassword
  });

  return user;
};

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
    config.jwt_access_secret as string,
    config.jwt_access_expires_in
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in
  );

  return {
    accessToken,
    refreshToken,
    user
  };
};

const refreshToken = async (token: string) => {
  const decoded = verifyToken(
    token,
    config.jwt_refresh_secret as string
  ) as any;

  const newAccessToken = createToken(
    { userId: decoded.userId, role: decoded.role },
    config.jwt_access_secret as string,
    config.jwt_access_expires_in
  );

  return { accessToken: newAccessToken };
};

export const AuthService = {
  registerUser,
  loginUser,
  refreshToken
};