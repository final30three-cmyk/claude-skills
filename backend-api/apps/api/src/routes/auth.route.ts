import { Router, type IRouter } from "express";
import { validate } from "../middleware/validate";
import { authLimiter } from "../middleware/rateLimit";
import { registerSchema, loginSchema, refreshSchema } from "../dto/auth.dto";
import {
  registerHandler,
  loginHandler,
  refreshHandler,
} from "../controllers/auth.controller";

export const authRouter: IRouter = Router();

authRouter.post("/register", authLimiter, validate(registerSchema), registerHandler);
authRouter.post("/login", authLimiter, validate(loginSchema), loginHandler);
authRouter.post("/refresh", validate(refreshSchema), refreshHandler);
