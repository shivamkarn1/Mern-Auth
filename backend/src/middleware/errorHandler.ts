import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(`[${req.method}] ${req.path}`, err);
  const status = (err as any)?.statusCode ?? (err as any)?.status ?? 500;
  const message = (err as any)?.message ?? "Internal server error";
  if (process.env.NODE_ENV === "development") {
    return res.status(status).json({ message, stack: (err as any)?.stack });
  }
  return res.status(status).json({ message });
};

export { errorHandler };
