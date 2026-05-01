import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import status from "http-status";
import config from "../config";
import AppError from "./AppError";

const auth = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;

        if (!token) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized");
        }

        try {
            const decoded = jwt.verify(
                token,
                config.jwt_access_secret as string
            ) as any;

            req.user = decoded;

            if (roles.length && !roles.includes(decoded.role)) {
                throw new AppError(status.FORBIDDEN, "Forbidden");
            }

            next();
        } catch {
            throw new AppError(status.UNAUTHORIZED, "Invalid token");
        }
    };
};

export default auth;