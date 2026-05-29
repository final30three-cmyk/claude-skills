import { config as defaultConfig } from "./default";
import { config as productionConfig } from "./production";

const env = process.env.NODE_ENV || "development";

export const config = env === "production" ? productionConfig : defaultConfig;
