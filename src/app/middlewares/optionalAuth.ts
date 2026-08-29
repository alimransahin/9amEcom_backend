import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import status from "http-status";

import config from "../config";
import AppError from "../../errors/AppError";

const optionalAuth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    // Guest user
    if (!authHeader) {
        return next();
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        throw new AppError(
            status.UNAUTHORIZED,
            "Invalid token"
        );
    }

    try {
        const decoded = jwt.verify(
            token,
            config.jwt_access_secret as string
        ) as {
            userId: string;
            role: string;
        };

        req.user = decoded;

        next();

    } catch (error) {
        throw new AppError(
            status.UNAUTHORIZED,
            "Invalid token"
        );
    }
};

export default optionalAuth;