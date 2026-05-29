export class AppError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly field: string | null;
  public readonly expose: boolean;

  constructor(
    message: string,
    status: number,
    code: string,
    field: string | null = null
  ) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.field = field;
    this.expose = status < 500;
  }

  static badRequest(message: string, field?: string) {
    return new AppError(message, 400, "BAD_REQUEST", field ?? null);
  }

  static unauthorized(message = "Missing or invalid auth token") {
    return new AppError(message, 401, "UNAUTHORIZED");
  }

  static forbidden(message = "Insufficient permissions") {
    return new AppError(message, 403, "FORBIDDEN");
  }

  static notFound(message = "Resource not found") {
    return new AppError(message, 404, "NOT_FOUND");
  }

  static conflict(message: string, field?: string) {
    return new AppError(message, 409, "CONFLICT", field ?? null);
  }
}
