import { buildPaginationMeta } from "@backend-api/shared";
import type { PaginatedResult, PaginationParams } from "@backend-api/shared";
import { AppError } from "@backend-api/shared";
import { productRepository } from "../repositories/product.repository";
import type { Product } from "../models/product.model";
import type { CreateProductDto, UpdateProductDto } from "../dto/product.dto";

export function list(
  params: PaginationParams,
  filters?: Record<string, string>
): PaginatedResult<Product> {
  const { items, total } = productRepository.findAll(params, filters);
  return { items, meta: buildPaginationMeta(total, params) };
}

export function getById(id: string): Product {
  const product = productRepository.findById(id);
  if (!product) throw AppError.notFound("Product not found");
  return product;
}

export function create(dto: CreateProductDto): Product {
  return productRepository.create({
    name: dto.name,
    price: dto.price,
    description: dto.description ?? null,
    categoryId: dto.categoryId,
    stock: dto.stock ?? 0,
  });
}

export function update(id: string, dto: UpdateProductDto): Product {
  const updated = productRepository.update(id, {
    ...dto,
    description: dto.description ?? undefined,
  });
  if (!updated) throw AppError.notFound("Product not found");
  return updated;
}

export function remove(id: string): void {
  const deleted = productRepository.delete(id);
  if (!deleted) throw AppError.notFound("Product not found");
}
