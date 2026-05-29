import { buildPaginationMeta } from "@backend-api/shared";
import type { PaginatedResult, PaginationParams } from "@backend-api/shared";
import { AppError } from "@backend-api/shared";
import { userRepository } from "../repositories/user.repository";
import type { User, PublicUser } from "../models/user.model";
import type { UpdateUserDto } from "../dto/user.dto";

function stripPassword(user: User): PublicUser {
  const { passwordHash: _, ...rest } = user;
  return rest;
}

export function list(params: PaginationParams): PaginatedResult<PublicUser> {
  const { items, total } = userRepository.findAll(params);
  return {
    items: items.map(stripPassword),
    meta: buildPaginationMeta(total, params),
  };
}

export function getById(id: string): PublicUser {
  const user = userRepository.findById(id);
  if (!user) throw AppError.notFound("User not found");
  return stripPassword(user);
}

export function update(id: string, dto: UpdateUserDto): PublicUser {
  const updated = userRepository.update(id, dto);
  if (!updated) throw AppError.notFound("User not found");
  return stripPassword(updated);
}

export function remove(id: string): void {
  const deleted = userRepository.delete(id);
  if (!deleted) throw AppError.notFound("User not found");
}
