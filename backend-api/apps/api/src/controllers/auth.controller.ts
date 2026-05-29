import type { RequestHandler } from "express";
import * as authService from "../services/auth.service";
import type { RegisterDto, LoginDto, RefreshDto } from "../dto/auth.dto";

export const registerHandler: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.register(req.body as RegisterDto);
    res.status(201).json({ data: result });
  } catch (err) {
    next(err);
  }
};

export const loginHandler: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.login(req.body as LoginDto);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
};

export const refreshHandler: RequestHandler = (req, res, next) => {
  try {
    const { refreshToken } = req.body as RefreshDto;
    const tokens = authService.refresh(refreshToken);
    res.json({ data: tokens });
  } catch (err) {
    next(err);
  }
};
