import { expect, test } from "@playwright/test";

test("landing to diagnosis smoke", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "AIと話すだけで、転職の準備が前に進む",
    }),
  ).toBeVisible();
  await page.getByRole("link", { name: "1分診断を始める" }).click();
  await expect(page).toHaveURL(/diagnosis/);
});
