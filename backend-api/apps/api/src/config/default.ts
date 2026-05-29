export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwt: {
    secret: process.env.JWT_SECRET || "dev-secret-change-me",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "dev-refresh-secret-change-me",
    accessTtl: "15m",
    refreshTtl: "7d",
  },
  bcrypt: {
    saltRounds: 12,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 100,
    maxAuthRequests: 10,
  },
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },
  logLevel: process.env.LOG_LEVEL || "debug",
};

export type AppConfig = typeof config;
