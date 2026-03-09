import { describe, expect, it } from "vitest";

import { getFewShotExamples } from "@/lib/ai/few-shots";
import { inferConstructionCategory } from "@/lib/constants/app";

describe("construction few-shots", () => {
  it("infers CAD/BIM category from interview answers", () => {
    const category = inferConstructionCategory([
      {
        questionId: "construction-role",
        question: "職種カテゴリ",
        answer: "CADオペレーター / BIM補助",
        skipped: false,
      },
    ]);

    expect(category).toBe("CAD/BIM");
  });

  it("returns few-shot examples for construction profile generation", () => {
    const examples = getFewShotExamples("施工管理", "profile");
    expect(examples.length).toBeGreaterThanOrEqual(2);
  });
});
