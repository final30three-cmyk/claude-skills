import type { RequestHandler } from "express";
import { clampPagination, UserRole } from "@backend-api/shared";
import * as userService from "../services/user.service";
import type { UpdateUserDto } from "../dto/user.dto";

export const listUsers: RequestHandler = (req, res, next) => {
  try {
    const params = clampPagination(req.query as Record<string, string>);
    const result = userService.list(params);
    res.json({ data: result.items, meta: result.meta });
  } catch (err) {
    next(err);
  }
};

export const getUser: RequestHandler = (req, res, next) => {
  try {
    const item = userService.getById(req.params.id as string);
    res.json({ data: item });
  } catch (err) {
    next(err);
  }
};

export const getMe: RequestHandler = (req, res, next) => {
  try {
    const item = userService.getById(req.user!.userId);
    res.json({ data: item });
  } catch (err) {
    next(err);
  }
};

export const updateUser: RequestHandler = (req, res, next) => {
  try {
    const isAdmin = req.user?.role === UserRole.ADMIN;
    const targetId = req.params.id as string;
    if (!isAdmin && targetId !== req.user?.userId) {
      res.status(403).json({ error: "Cannot update other users" });
      return;
    }
    const item = userService.update(targetId, req.body as UpdateUserDto);
    res.json({ data: item });
  } catch (err) {
    next(err);
  }
};

export const deleteUser: RequestHandler = (req, res, next) => {
  try {
    userService.remove(req.params.id as string);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
