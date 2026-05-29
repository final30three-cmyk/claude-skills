import { Router, type IRouter } from "express";
import { UserRole } from "@backend-api/shared";
import { authenticate, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { updateUserSchema } from "../dto/user.dto";
import {
  listUsers,
  getUser,
  getMe,
  updateUser,
  deleteUser,
} from "../controllers/users.controller";

export const usersRouter: IRouter = Router();

usersRouter.get("/me", authenticate, getMe);
usersRouter.get("/", authenticate, requireRole(UserRole.ADMIN), listUsers);
usersRouter.get("/:id", authenticate, getUser);
usersRouter.put("/:id", authenticate, validate(updateUserSchema), updateUser);
usersRouter.delete("/:id", authenticate, requireRole(UserRole.ADMIN), deleteUser);
