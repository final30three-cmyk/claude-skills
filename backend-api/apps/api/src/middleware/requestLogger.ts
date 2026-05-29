import type { RequestHandler } from "express";

export const requestLogger: RequestHandler = (req, _res, next) => {
  const start = Date.now();
  const { method, url } = req;

  req.on("close", () => {
    const duration = Date.now() - start;
    console.log(`${method} ${url} ${duration}ms`);
  });

  next();
};
