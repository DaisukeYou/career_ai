import { expect, test } from "@playwright/test";

test("offer review handles refusal/partial and full result", async ({ page }) => {
  await page.goto("/offer-review");

  await page.getByLabel("条件通知の文面").fill("年収420万円");
  await page.getByRole("button", { name: "確認論点を整理する" }).click();
  await expect(page.getByText("入力の補足が必要です")).toBeVisible();

  await page
    .getByLabel("条件通知の文面")
    .fill("想定年収420万円、月給35万円、固定残業45時間分を含む、勤務地東京都渋谷区、試用期間3か月、昇給あり、賞与あり。");
  await page.getByRole("button", { name: "確認論点を整理する" }).click();
  await expect(page.getByText(/一部補足すると精度が上がります|レビュー結果/)).toBeVisible();

  await page
    .getByLabel("条件通知の文面")
    .fill(
      "想定年収420万円、月給35万円、固定残業45時間分を含む、勤務地東京都渋谷区、試用期間3か月、昇給あり、賞与あり、評価改定は年1回、雇用形態は正社員、土日祝休み。",
    );
  await page.getByRole("button", { name: "確認論点を整理する" }).click();
  await expect(page.getByText("overallConfidence")).toBeVisible();
  await expect(page.getByText("needsHumanReview")).toBeVisible();
  await expect(page.getByText("不足情報")).toBeVisible();
});
