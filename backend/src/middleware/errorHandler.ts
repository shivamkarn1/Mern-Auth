import { ZodError } from "zod";
import { ErrorRequestHandler, Response } from "express";
import { BAD_REQUEST } from "../constants/http";
import { AppError } from "../utils/AppError";
import { clearAuthCookies, REFRESH_PATH } from "../utils/setAuthCookies";

const handleZodError = (res: Response, error: ZodError) => {
  const errors = error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
  return res.status(BAD_REQUEST).json({
    message: error.message,
    errors,
  });
};

const handleAppError = (res: Response, error: AppError) => {
  return res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
  });
};

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(`[${req.method}] ${req.path}`, err);

  if (req.path === REFRESH_PATH) {
    clearAuthCookies(res);
  }

  if (err instanceof ZodError) {
    return handleZodError(res, err);
  }
  if (err instanceof AppError) {
    return handleAppError(res, err);
  }
  const status = (err as any)?.statusCode ?? (err as any)?.status ?? 500;
  const message = (err as any)?.message ?? "Internal server error";
  if (process.env.NODE_ENV === "development") {
    return res.status(status).json({ message, stack: (err as any)?.stack });
  }
  return res.status(status).json({ message });
};

export { errorHandler };
