import type {
  CareerHistoryDraft,
  MotivationDraft,
  ResumeDraft,
  SelfPRDraft,
} from "@/lib/schemas/domain";

export function formatMarkdownExport(input: {
  resumeDraft: ResumeDraft | null;
  careerHistoryDraft: CareerHistoryDraft | null;
  selfPRDraft: SelfPRDraft | null;
  motivationDraft: MotivationDraft | null;
}) {
  const sections = ["# 転職OS 書類下書き"];

  if (input.resumeDraft?.result) {
    sections.push(
      "## 履歴書",
      `- 現職: ${input.resumeDraft.result.basicInfo.currentRole}`,
      `- 希望勤務地: ${input.resumeDraft.result.basicInfo.preferredLocation}`,
      "",
      input.resumeDraft.result.summary,
      "",
      "### 強み",
      ...input.resumeDraft.result.strengths.map((item) => `- ${item}`),
    );
  }

  if (input.careerHistoryDraft?.result) {
    sections.push("## 職務経歴書", input.careerHistoryDraft.result.headline);
    input.careerHistoryDraft.result.experiences.forEach((experience) => {
      sections.push(
        `### ${experience.company} / ${experience.role}`,
        `- 期間: ${experience.period}`,
        ...experience.responsibilities.map((item) => `- 担当: ${item}`),
        ...experience.achievements.map((item) => `- 実績: ${item}`),
      );
    });
  }

  if (input.selfPRDraft?.result) {
    sections.push("## 自己PR", input.selfPRDraft.result.body);
  }

  if (input.motivationDraft?.result) {
    sections.push("## 志望動機", input.motivationDraft.result.body);
  }

  return sections.join("\n");
}

export function downloadMarkdown(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
