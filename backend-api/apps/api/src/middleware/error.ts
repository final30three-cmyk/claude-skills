import type { ErrorRequestHandler } from "express";
import { AppError } from "@backend-api/shared";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof AppError) {
    if (err.status >= 500) {
      console.error({ err, req: { method: req.method, url: req.url } });
    }
    res.status(err.status).json({
      error: err.message,
      code: err.code,
      field: err.field,
    });
    return;
  }

  console.error({ err, req: { method: req.method, url: req.url } });
  res.status(500).json({
    error: "Internal server error",
    code: null,
    field: null,
  });
};
