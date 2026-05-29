import crypto from "crypto";
import type { Product } from "../models/product.model";
import type { PaginationParams } from "@backend-api/shared";

const products: Map<string, Product> = new Map();

export const productRepository = {
  findAll(
    params: PaginationParams,
    filters?: Record<string, string>
  ): { items: Product[]; total: number } {
    let all = Array.from(products.values());

    if (filters?.categoryId) {
      all = all.filter((p) => p.categoryId === filters.categoryId);
    }
    if (filters?.name) {
      const q = filters.name.toLowerCase();
      all = all.filter((p) => p.name.toLowerCase().includes(q));
    }

    const start = (params.page - 1) * params.limit;
    return {
      items: all.slice(start, start + params.limit),
      total: all.length,
    };
  },

  findById(id: string): Product | undefined {
    return products.get(id);
  },

  create(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Product {
    const now = new Date();
    const product: Product = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    products.set(product.id, product);
    return product;
  },

  update(id: string, data: Partial<Product>): Product | undefined {
    const existing = products.get(id);
    if (!existing) return undefined;
    const updated: Product = {
      ...existing,
      ...data,
      id,
      updatedAt: new Date(),
    };
    products.set(id, updated);
    return updated;
  },

  delete(id: string): boolean {
    return products.delete(id);
  },
};
