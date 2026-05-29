import { config as defaults } from "./default";

export const config: typeof defaults = {
  ...defaults,
  nodeEnv: "production",
  logLevel: "info",
  cors: {
    origin: process.env.CORS_ORIGIN || "",
  },
};
