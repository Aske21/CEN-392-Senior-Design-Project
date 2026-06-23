import { afterEach, describe, expect, it } from "vitest";
import { getAuthTokenFromStorage } from "./auth";

describe("getAuthTokenFromStorage", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("returns null when no persisted auth state exists", () => {
    expect(getAuthTokenFromStorage()).toBeNull();
  });

  it("returns the token from redux-persist storage", () => {
    localStorage.setItem(
      "persist:root",
      JSON.stringify({
        auth: JSON.stringify({ token: "test-jwt-token", user: null }),
      }),
    );

    expect(getAuthTokenFromStorage()).toBe("test-jwt-token");
  });

  it("returns null when persisted auth JSON is invalid", () => {
    localStorage.setItem(
      "persist:root",
      JSON.stringify({ auth: "not-valid-json" }),
    );

    expect(getAuthTokenFromStorage()).toBeNull();
  });
});
