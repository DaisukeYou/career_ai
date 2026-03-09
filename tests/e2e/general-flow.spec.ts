import { expect, test } from "@playwright/test";

test("general flow from diagnosis to documents and interview prep", async ({ page }) => {
  await page.goto("/diagnosis");
  await page.getByRole("button", { name: "カスタマーサクセス" }).click();
  await expect(page.getByText("仮の強みタグ")).toBeVisible();
  await page.getByRole("link", { name: "5分AI面談で書類のたたき台を作る" }).click();
  await expect(page).toHaveURL(/interview/);
  await expect(page.getByRole("heading", { name: "5分AI面談" })).toBeVisible();
  await page.goto("/profile");
  await expect(page).toHaveURL(/profile/);
  await expect(page.getByRole("heading", { name: "面談結果" })).toBeVisible();

  await page.getByRole("link", { name: "履歴書のたたき台を見る" }).click();
  await expect(page).toHaveURL(/documents/);
  await expect(page.getByRole("tab", { name: "履歴書" })).toBeVisible();

  await page.goto("/interview-prep");
  await expect(page.getByRole("heading", { name: "面接準備" })).toBeVisible();
});
