import { Request, Response, NextFunction } from "express";

const notFound = (_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    data: null
  });
};

export default notFound;