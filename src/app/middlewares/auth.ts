import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import status from "http-status";
import config from "../config";
import AppError from "../../errors/AppError";

const auth = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized");
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            throw new AppError(status.UNAUTHORIZED, "Invalid token");
        }

        try {
            const decoded = jwt.verify(
                token,
                config.jwt_access_secret as string
            ) as any;

            req.user = decoded;

            // 🔥 role check
            if (roles.length && !roles.includes(decoded.role)) {
                throw new AppError(status.FORBIDDEN, "Forbidden");
            }

            next();

        } catch (err) {
            // 🔥 FIX
            if (err instanceof AppError) {
                throw err;
            }

            throw new AppError(status.UNAUTHORIZED, "Invalid token");
        }
    };
};

export default auth;