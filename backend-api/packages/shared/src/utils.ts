import type { PaginationMeta, PaginationParams } from "./types";

export function buildPaginationMeta(
  total: number,
  params: PaginationParams
): PaginationMeta {
  return {
    page: params.page,
    limit: params.limit,
    total,
    totalPages: Math.ceil(total / params.limit),
  };
}

export function clampPagination(raw: {
  page?: number;
  limit?: number;
}): PaginationParams {
  const page = Math.max(1, Number(raw.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(raw.limit) || 20));
  return { page, limit };
}
