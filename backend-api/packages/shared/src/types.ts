export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ApiResponse<T = unknown> {
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  error: string;
  code: string | null;
  field: string | null;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}
