import { describe, expect, it } from "vitest";
import authReducer, { logoutComplete, setCredentials } from "./authSlice";
import { loginUser } from "./authThunks";
import type { User } from "@/lib/api/auth";

const user: User = {
  id: 1,
  email: "shopper@example.com",
  username: "shopper",
  user_type: "customer",
};

describe("authSlice", () => {
  it("stores credentials when setCredentials is dispatched", () => {
    const state = authReducer(
      undefined,
      setCredentials({ user, token: "jwt-token" }),
    );

    expect(state.user).toEqual(user);
    expect(state.token).toBe("jwt-token");
    expect(state.error).toBeNull();
  });

  it("clears auth state on logoutComplete", () => {
    const authenticated = authReducer(
      undefined,
      setCredentials({ user, token: "jwt-token" }),
    );

    const state = authReducer(authenticated, logoutComplete());

    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.initialized).toBe(false);
  });

  it("handles successful login", () => {
    const state = authReducer(
      { user: null, token: null, loading: true, error: "Old error", initialized: false },
      loginUser.fulfilled({ user, token: "jwt-token" }, "", {
        email: user.email,
        password: "password",
      }),
    );

    expect(state.loading).toBe(false);
    expect(state.user).toEqual(user);
    expect(state.token).toBe("jwt-token");
    expect(state.error).toBeNull();
  });

  it("clears loading and stores a fallback error when login fails", () => {
    const state = authReducer(
      { user: null, token: null, loading: true, error: null, initialized: false },
      loginUser.rejected(new Error("Rejected"), "", {
        email: user.email,
        password: "wrong",
      }),
    );

    expect(state.loading).toBe(false);
    expect(state.user).toBeNull();
    expect(state.error).toBe("Login failed");
  });
});
