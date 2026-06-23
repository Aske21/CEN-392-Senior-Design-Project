import { describe, expect, it } from "vitest";
import {
  selectAuthToken,
  selectAuthUser,
  selectIsAuthenticated,
} from "./authSelectors";
import type { RootState } from "@/lib/store";
import type { User } from "@/lib/api/auth";

const user: User = {
  id: 1,
  email: "shopper@example.com",
  username: "shopper",
  user_type: "customer",
};

const buildState = (auth: RootState["auth"]): RootState =>
  ({
    auth,
    cart: { items: [] },
    _persist: { version: -1, rehydrated: true },
  }) as RootState;

describe("authSelectors", () => {
  it("selectIsAuthenticated is true only when user and token exist", () => {
    expect(
      selectIsAuthenticated(
        buildState({
          user,
          token: "jwt-token",
          loading: false,
          error: null,
          initialized: true,
        }),
      ),
    ).toBe(true);

    expect(
      selectIsAuthenticated(
        buildState({
          user,
          token: null,
          loading: false,
          error: null,
          initialized: true,
        }),
      ),
    ).toBe(false);

    expect(
      selectIsAuthenticated(
        buildState({
          user: null,
          token: "jwt-token",
          loading: false,
          error: null,
          initialized: true,
        }),
      ),
    ).toBe(false);
  });

  it("selectAuthUser and selectAuthToken return auth state values", () => {
    const state = buildState({
      user,
      token: "jwt-token",
      loading: false,
      error: null,
      initialized: true,
    });

    expect(selectAuthUser(state)).toEqual(user);
    expect(selectAuthToken(state)).toBe("jwt-token");
  });
});
