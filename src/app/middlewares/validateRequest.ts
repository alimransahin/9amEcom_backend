import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";
import catchAsync from "../utils/catchAsync";


const validateRequest = (schema: ZodSchema) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseBody = await schema.parseAsync(req.body);
      req.body = parseBody;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: error.issues[0]?.message || "Validation error",
          errors: error.issues,
        });
        return;
      }
      next(error);
    }
  });
};

export default validateRequest;
