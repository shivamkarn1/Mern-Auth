import { Request, Response, NextFunction } from "express";
import catchErrors from "../utils/catchErrors";
import { z } from "zod";

const registerSchema = z
  .object({
    email: z.string().email().min(1).max(255),
    password: z.string().min(7).max(255),
    confirmPassword: z.string().min(7).max(255),
    userAgent: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const registerHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // validate request
    const request = registerSchema.parse({
      ...req.body,
      userAgent: Array.isArray(req.headers["user-agent"])
        ? req.headers["user-agent"][0]
        : req.headers["user-agent"],
    });
    // call service

    // return response
  }
);

export { registerHandler };
