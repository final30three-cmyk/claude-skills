import { z } from "zod";
import { UserRole } from "@backend-api/shared";

export const updateUserSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  role: z.nativeEnum(UserRole).optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
