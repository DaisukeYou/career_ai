import { describe, expect, it } from "vitest";

import { mockAiProvider } from "@/lib/ai/mock-provider";
import { OFFER_REVIEW_DISCLAIMER } from "@/lib/constants/app";

describe("mockAiProvider", () => {
  it("returns refusal for too-short quick assessment input", async () => {
    const result = await mockAiProvider.generateQuickAssessment({
      currentRole: "営",
      desiredRole: "営",
      preferredLocation: "東",
      salaryRange: "300万〜400万円",
      currentWorry: "書類に自信がない",
      mode: "general",
    });

    expect(result.status).toBe("refusal");
  });

  it("returns offer review with disclaimer and review flags", async () => {
    const result = await mockAiProvider.generateOfferReview({
      rawText:
        "想定年収420万円、月給35万円、固定残業45時間含む、勤務地東京都渋谷区、試用期間3か月、賞与あり、昇給あり。",
      sourceType: "text",
      mode: "general",
    });

    expect(result.status).toBe("success");
    expect(result.result?.disclaimer).toBe(OFFER_REVIEW_DISCLAIMER);
    expect(result.result?.needsHumanReview).toBeTypeOf("boolean");
  });
});
