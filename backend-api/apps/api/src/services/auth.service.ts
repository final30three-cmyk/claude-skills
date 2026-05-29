import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { UserRole } from "@backend-api/shared";
import type { TokenPayload, TokenPair } from "@backend-api/shared";
import { AppError } from "@backend-api/shared";
import { config } from "../config";
import { userRepository } from "../repositories/user.repository";
import type { User, PublicUser } from "../models/user.model";
import type { RegisterDto, LoginDto } from "../dto/auth.dto";

function stripPassword(user: User): PublicUser {
  const { passwordHash: _, ...rest } = user;
  return rest;
}

export function issueTokens(payload: TokenPayload): TokenPair {
  return {
    accessToken: jwt.sign(
      { ...payload },
      config.jwt.secret,
      { expiresIn: config.jwt.accessTtl } as SignOptions
    ),
    refreshToken: jwt.sign(
      { ...payload },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshTtl } as SignOptions
    ),
  };
}

export function verifyAccess(token: string): TokenPayload {
  return jwt.verify(token, config.jwt.secret) as TokenPayload;
}

export function verifyRefresh(token: string): TokenPayload {
  return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
}

export async function register(dto: RegisterDto) {
  const existing = userRepository.findByEmail(dto.email);
  if (existing) {
    throw AppError.conflict("Email already registered", "email");
  }

  const passwordHash = await bcrypt.hash(dto.password, config.bcrypt.saltRounds);
  const user = userRepository.create({
    email: dto.email,
    name: dto.name,
    passwordHash,
    role: UserRole.USER,
  });

  const tokens = issueTokens({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return { user: stripPassword(user), tokens };
}

export async function login(dto: LoginDto) {
  const user = userRepository.findByEmail(dto.email);
  if (!user) {
    throw AppError.unauthorized("Invalid credentials");
  }

  const valid = await bcrypt.compare(dto.password, user.passwordHash);
  if (!valid) {
    throw AppError.unauthorized("Invalid credentials");
  }

  const tokens = issueTokens({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return { user: stripPassword(user), tokens };
}

export function refresh(refreshToken: string) {
  try {
    const payload = verifyRefresh(refreshToken);
    const user = userRepository.findById(payload.userId);
    if (!user) {
      throw AppError.unauthorized("User no longer exists");
    }
    return issueTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw AppError.unauthorized("Invalid refresh token");
  }
}
