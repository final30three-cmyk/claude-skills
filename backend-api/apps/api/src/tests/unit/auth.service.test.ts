import { issueTokens, verifyAccess } from "../../services/auth.service";
import { UserRole } from "@backend-api/shared";
import type { TokenPayload } from "@backend-api/shared";

describe("auth.service", () => {
  const payload: TokenPayload = {
    userId: "test-id",
    email: "test@example.com",
    role: UserRole.USER,
  };

  it("should issue and verify access tokens", () => {
    const tokens = issueTokens(payload);
    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();

    const decoded = verifyAccess(tokens.accessToken);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
  });

  it("should reject invalid tokens", () => {
    expect(() => verifyAccess("invalid-token")).toThrow();
  });
});
