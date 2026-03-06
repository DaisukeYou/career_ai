import { describe, expect, it } from "vitest";

import { formatMarkdownExport } from "@/lib/utils/format";

describe("formatMarkdownExport", () => {
  it("includes the main document sections", () => {
    const markdown = formatMarkdownExport({
      resumeDraft: {
        status: "success",
        message: "",
        result: {
          basicInfo: {
            fullName: "",
            currentRole: "CS",
            preferredLocation: "東京",
          },
          summary: "summary",
          strengths: ["顧客折衝"],
        },
      },
      careerHistoryDraft: {
        status: "success",
        message: "",
        result: {
          headline: "headline",
          experiences: [
            {
              company: "A社",
              period: "2024-",
              role: "CS",
              responsibilities: ["導入支援"],
              achievements: ["改善提案"],
              metricsSuggestions: [],
            },
          ],
        },
      },
      selfPRDraft: {
        status: "success",
        message: "",
        result: {
          tone: "balanced",
          body: "自己PR本文",
          starBullets: [],
          numericSuggestions: [],
        },
      },
      motivationDraft: {
        status: "success",
        message: "",
        result: {
          templateLabel: "template",
          body: "志望動機本文",
          customizationTips: [],
        },
      },
    });

    expect(markdown).toContain("## 履歴書");
    expect(markdown).toContain("## 職務経歴書");
    expect(markdown).toContain("## 自己PR");
    expect(markdown).toContain("## 志望動機");
  });
});
