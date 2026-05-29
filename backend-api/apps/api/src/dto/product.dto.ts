import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1).max(200),
  price: z.number().positive(),
  description: z.string().max(2000).optional(),
  categoryId: z.string().uuid(),
  stock: z.number().int().min(0).default(0),
});

export const productUpdateSchema = productSchema.partial();

export type CreateProductDto = z.infer<typeof productSchema>;
export type UpdateProductDto = z.infer<typeof productUpdateSchema>;
