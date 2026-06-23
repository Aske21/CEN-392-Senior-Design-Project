import { describe, expect, it } from "vitest";
import { AuthService } from "../../services/auth-service";

describe("AuthService", () => {
  it("verifyToken rejects malformed tokens", async () => {
    const authService = new AuthService();

    await expect(authService.verifyToken("not-a-valid-token")).rejects.toThrow(
      /Invalid token/i,
    );
  });
});
