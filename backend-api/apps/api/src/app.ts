import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config";
import { healthRouter } from "./routes/health.route";
import { authRouter } from "./routes/auth.route";
import { productsRouter } from "./routes/products.route";
import { usersRouter } from "./routes/users.route";
import { errorHandler } from "./middleware/error";
import { requestLogger } from "./middleware/requestLogger";
import { apiLimiter } from "./middleware/rateLimit";

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: config.cors.origin }));
  app.use(express.json({ limit: "1mb" }));
  app.use(requestLogger);
  app.use(apiLimiter);

  app.use("/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/users", usersRouter);

  app.use(errorHandler);

  return app;
}
