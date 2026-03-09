import { describe, expect, it } from "vitest";

import { partializeSessionState } from "@/lib/store/session";
import { normalizeGenerationResult } from "@/lib/schemas/domain";

describe("partializeSessionState", () => {
  it("does not persist sensitive fields or offer review content", () => {
    const partial = partializeSessionState({
      mode: "general",
      quickAssessmentInput: {
        currentRole: "CS",
        desiredRole: "CS",
        preferredLocation: "東京",
        salaryRange: "400万〜500万円",
        currentWorry: "書類に自信がない",
        mode: "general",
      },
      quickAssessment: null,
      interviewAnswers: [],
      generatedProfile: null,
      resumeDraft: {
        status: "ok",
        message: "",
        result: {
          basicInfo: {
            fullName: "山田花子",
            currentRole: "CS",
            preferredLocation: "東京",
            phone: "090",
            email: "test@example.com",
          },
          summary: "",
          strengths: [],
        },
      },
      careerHistoryDraft: null,
      selfPRDraft: null,
      motivationDraft: null,
      interviewPrep: null,
      offerReview: {
        status: "ok",
        message: "",
        result: {
          basicTerms: [],
          redFlagPoints: [],
          checkQuestions: [],
          negotiationDraft: "",
          missingInfo: [],
          overallConfidence: "medium",
          needsHumanReview: false,
          disclaimer: "",
        },
      },
      selectedSampleId: undefined,
      lastSavedAt: undefined,
      sensitiveProfileInput: {
        fullName: "山田花子",
        phone: "090",
        email: "test@example.com",
      },
      offerReviewRawText: "raw",
    });

    expect("resumeDraft" in partial).toBe(false);
    expect("offerReview" in partial).toBe(false);
    expect("offerReviewRawText" in partial).toBe(false);
    expect("sensitiveProfileInput" in partial).toBe(false);
  });

  it("normalizes legacy success status to ok", () => {
    const normalized = normalizeGenerationResult({
      status: "success",
      message: "ok",
      result: {
        mode: "general" as const,
        strengthTags: ["a", "b", "c"] as [string, string, string],
        nextActions: ["a", "b", "c"] as [string, string, string],
        improvementPoints: ["a", "b", "c"] as [string, string, string],
        summary: "summary",
      },
    });

    expect(normalized.status).toBe("ok");
  });
});
