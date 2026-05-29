import crypto from "crypto";
import type { User } from "../models/user.model";
import type { PaginationParams } from "@backend-api/shared";

const users: Map<string, User> = new Map();

export const userRepository = {
  findAll(params: PaginationParams): { items: User[]; total: number } {
    const all = Array.from(users.values());
    const start = (params.page - 1) * params.limit;
    return {
      items: all.slice(start, start + params.limit),
      total: all.length,
    };
  },

  findById(id: string): User | undefined {
    return users.get(id);
  },

  findByEmail(email: string): User | undefined {
    return Array.from(users.values()).find((u) => u.email === email);
  },

  create(data: Omit<User, "id" | "createdAt" | "updatedAt">): User {
    const now = new Date();
    const user: User = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    users.set(user.id, user);
    return user;
  },

  update(id: string, data: Partial<User>): User | undefined {
    const existing = users.get(id);
    if (!existing) return undefined;
    const updated: User = { ...existing, ...data, id, updatedAt: new Date() };
    users.set(id, updated);
    return updated;
  },

  delete(id: string): boolean {
    return users.delete(id);
  },
};
