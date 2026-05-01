import { NextFunction, Request, Response } from "express";
import AppError from "./AppError";
import config from "../config";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong!",
    error: config.node_env === "development" ? err : undefined
  });
};

export default globalErrorHandler;