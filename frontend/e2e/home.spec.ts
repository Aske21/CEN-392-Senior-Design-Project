import { expect, test } from "@playwright/test";

test.describe("Public pages", () => {
  test("home page shows hero content and shop link", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Welcome to ShoppyDev" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Shop now" })).toBeVisible();
  });

  test("about page is reachable from the home page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Learn more" }).click();

    await expect(page).toHaveURL(/\/about$/);
    await expect(
      page.getByRole("heading", { name: "About Us" }),
    ).toBeVisible();
  });
});
