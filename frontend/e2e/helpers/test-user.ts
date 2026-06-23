import type { APIRequestContext } from "@playwright/test";

export const API_URL =
  process.env.PLAYWRIGHT_API_URL ?? "http://localhost:8080";

export type TestUser = {
  email: string;
  password: string;
  username: string;
};

export function createTestUser(prefix = "e2e"): TestUser {
  const uniqueId = Date.now();

  return {
    email: `${prefix}-${uniqueId}@example.com`,
    password: "password123",
    username: `${prefix}user${uniqueId}`,
  };
}

export async function registerTestUser(
  request: APIRequestContext,
  user: TestUser,
) {
  return request.post(`${API_URL}/auth/register`, {
    data: {
      email: user.email,
      password: user.password,
      username: user.username,
    },
  });
}
