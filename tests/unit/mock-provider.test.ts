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

    expect(result.status).toBe("partial");
    expect(result.result?.disclaimer).toBe(OFFER_REVIEW_DISCLAIMER);
    expect(result.result?.needsHumanReview).toBeTypeOf("boolean");
  });

  it("returns partial interview prep when answers are thin", async () => {
    const profile = await mockAiProvider.generateProfile({
      mode: "general",
      quickAssessment: {
        currentRole: "法人営業",
        desiredRole: "法人営業",
        preferredLocation: "東京",
        salaryRange: "400万〜500万円",
        currentWorry: "書類に自信がない",
        mode: "general",
      },
      answers: [
        { questionId: "1", question: "q1", answer: "営業です", skipped: false },
        { questionId: "2", question: "q2", answer: "提案です", skipped: false },
        { questionId: "3", question: "q3", answer: "改善です", skipped: false },
      ],
    });

    const result = await mockAiProvider.generateInterviewPrep({
      mode: "general",
      quickAssessment: {
        currentRole: "法人営業",
        desiredRole: "法人営業",
        preferredLocation: "東京",
        salaryRange: "400万〜500万円",
        currentWorry: "書類に自信がない",
        mode: "general",
      },
      answers: [
        { questionId: "1", question: "q1", answer: "営業です", skipped: false },
        { questionId: "2", question: "q2", answer: "提案です", skipped: false },
        { questionId: "3", question: "q3", answer: "改善です", skipped: false },
      ],
      profile,
    });

    expect(result.status).toBe("partial");
  });
});
