/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";

const notFound = (_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: "The requested API endpoint does not exist.",
    data: null,
  });
};

export default notFound;
