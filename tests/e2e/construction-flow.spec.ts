import { expect, test } from "@playwright/test";

test("construction flow shows branch-specific content", async ({ page }) => {
  await page.goto("/diagnosis");
  await page.getByRole("button", { name: "建築施工管理" }).click();
  await expect(page.getByText("工程調整")).toBeVisible();

  await page.getByRole("link", { name: "5分AI面談で書類のたたき台を作る" }).click();
  await expect(page).toHaveURL(/interview/);
  await expect(page.getByText("5分AI面談")).toBeVisible();

  await page.goto("/documents");
  await expect(page.getByText("案件実績")).toBeVisible();
  await expect(page.getByText("保有資格")).toBeVisible();
  await expect(page.getByText("工種経験")).toBeVisible();
});
