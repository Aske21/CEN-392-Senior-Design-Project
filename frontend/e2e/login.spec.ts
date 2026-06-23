import { expect, test } from "@playwright/test";
import { createTestUser, registerTestUser } from "./helpers/test-user";

test.describe("Login", () => {
  test("user can sign in with email and password", async ({ page, request }) => {
    const user = createTestUser();
    const registerResponse = await registerTestUser(request, user);

    expect(registerResponse.ok()).toBeTruthy();

    await page.goto("/login");
    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Password").fill(user.password);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();

    await expect(page).not.toHaveURL(/\/login$/);

    await page.goto("/profile");
    await expect(
      page.getByRole("heading", { name: "My Profile" }),
    ).toBeVisible();
    await expect(page.getByText(user.email)).toBeVisible();
  });

  test("shows client-side validation errors for invalid credentials", async ({
    page,
  }) => {
    await page.goto("/login");

    const loginForm = page
      .locator("form")
      .filter({ has: page.getByRole("button", { name: "Sign in", exact: true }) });

    await loginForm.getByLabel("Email").fill("not-an-email");
    await loginForm.getByLabel("Password").fill("123");
    await loginForm.getByRole("button", { name: "Sign in", exact: true }).click();

    await expect(loginForm.getByText("Invalid email address")).toBeVisible();
    await expect(
      loginForm.getByText("Password must be at least 6 characters"),
    ).toBeVisible();
  });
});
