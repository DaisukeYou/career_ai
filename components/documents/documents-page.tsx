"use client";

import { useEffect, useState, useTransition } from "react";

import { generateDocumentsAction } from "@/app/actions/documents";
import { EmptyState } from "@/components/common/empty-state";
import { GenerationStatePanel } from "@/components/common/generation-state-panel";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toneOptions } from "@/lib/constants/app";
import { useCareerSessionStore } from "@/lib/store/session";
import { downloadMarkdown, formatMarkdownExport } from "@/lib/utils/format";

export function DocumentsPage() {
  const {
    mode,
    quickAssessmentInput,
    interviewAnswers,
    generatedProfile,
    resumeDraft,
    careerHistoryDraft,
    selfPRDraft,
    motivationDraft,
    sensitiveProfileInput,
    setSensitiveProfileInput,
    setResumeDraft,
    setCareerHistoryDraft,
    setSelfPRDraft,
    setMotivationDraft,
  } = useCareerSessionStore();
  const [pending, startGeneration] = useTransition();
  const [tone, setTone] = useState("balanced");

  useEffect(() => {
    if (!generatedProfile || resumeDraft || !quickAssessmentInput) return;
    startGeneration(async () => {
      const bundle = await generateDocumentsAction({
        mode,
        quickAssessment: quickAssessmentInput,
        answers: interviewAnswers,
        profile: generatedProfile,
        tone: tone as never,
        sensitiveInput: sensitiveProfileInput,
      });
      setResumeDraft(bundle.resumeDraft);
      setCareerHistoryDraft(bundle.careerHistoryDraft);
      setSelfPRDraft(bundle.selfPRDraft);
      setMotivationDraft(bundle.motivationDraft);
    });
  }, [
    generatedProfile,
    resumeDraft,
    quickAssessmentInput,
    mode,
    interviewAnswers,
    tone,
    sensitiveProfileInput,
    startGeneration,
    setResumeDraft,
    setCareerHistoryDraft,
    setSelfPRDraft,
    setMotivationDraft,
  ]);

  if (!generatedProfile || !quickAssessmentInput) {
    return (
      <EmptyState
        title="書類のたたき台はまだありません"
        description="面談結果ができると、履歴書・職務経歴書・自己PR・志望動機を順に作れます。"
        href="/profile"
        cta="面談結果へ戻る"
      />
    );
  }

  return (
    <div className="space-y-8">
      <Card className="rounded-[2rem] border-white/70 bg-white/85 shadow-none">
        <CardHeader className="space-y-4">
          <PageHeader
            mode={mode}
            title="書類ページ"
            description="必要なタイミングで生成し、画面上でそのまま整えられる構成です。"
          />
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">氏名</Label>
              <Input
                id="fullName"
                value={sensitiveProfileInput.fullName ?? ""}
                onChange={(event) => setSensitiveProfileInput({ fullName: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">電話</Label>
              <Input
                id="phone"
                value={sensitiveProfileInput.phone ?? ""}
                onChange={(event) => setSensitiveProfileInput({ phone: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">メール</Label>
              <Input
                id="email"
                value={sensitiveProfileInput.email ?? ""}
                onChange={(event) => setSensitiveProfileInput({ email: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">文章トーン</Label>
              <select
                id="tone"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={tone}
                onChange={(event) => setTone(event.target.value)}
              >
                {toneOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {pending ? <LoadingSkeleton lines={10} /> : null}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => {
                const markdown = formatMarkdownExport({
                  resumeDraft,
                  careerHistoryDraft,
                  selfPRDraft,
                  motivationDraft,
                });
                downloadMarkdown("career-os-drafts.md", markdown);
              }}
            >
              Markdownを書き出す
            </Button>
          </div>
          <Tabs defaultValue="resume" className="space-y-5">
            <TabsList className="flex h-auto flex-wrap gap-2 rounded-2xl bg-slate-100 p-2">
              <TabsTrigger value="resume" className="rounded-full">
                履歴書
              </TabsTrigger>
              <TabsTrigger value="career" className="rounded-full">
                職務経歴書
              </TabsTrigger>
              <TabsTrigger value="selfpr" className="rounded-full">
                自己PR
              </TabsTrigger>
              <TabsTrigger value="motivation" className="rounded-full">
                志望動機
              </TabsTrigger>
            </TabsList>
            <TabsContent value="resume">
              <DocumentEditor
                title="履歴書"
                status={resumeDraft?.status}
                message={resumeDraft?.message}
                refusalReason={resumeDraft?.refusalReason}
                body={resumeDraft?.result?.summary ?? ""}
                onChange={(value) =>
                  resumeDraft?.result
                    ? setResumeDraft({
                        ...resumeDraft,
                        result: { ...resumeDraft.result, summary: value },
                      })
                    : undefined
                }
                extras={
                  mode === "construction" && resumeDraft?.result?.constructionMeta ? (
                    <div className="grid gap-4 md:grid-cols-3">
                      <MetaCard title="案件実績" items={resumeDraft.result.constructionMeta.projectTypes} />
                      <MetaCard title="保有資格" items={resumeDraft.result.licenses ?? []} />
                      <MetaCard title="工種経験" items={resumeDraft.result.constructionMeta.tradeScopes} />
                    </div>
                  ) : null
                }
              />
            </TabsContent>
            <TabsContent value="career">
              <DocumentEditor
                title="職務経歴書"
                status={careerHistoryDraft?.status}
                message={careerHistoryDraft?.message}
                refusalReason={careerHistoryDraft?.refusalReason}
                body={
                  careerHistoryDraft?.result
                    ? [
                        careerHistoryDraft.result.headline,
                        ...careerHistoryDraft.result.experiences.map(
                          (experience) =>
                            `${experience.company} / ${experience.role}\n- ${experience.responsibilities.join("\n- ")}`,
                        ),
                      ].join("\n\n")
                    : ""
                }
                onChange={() => undefined}
              />
            </TabsContent>
            <TabsContent value="selfpr">
              <DocumentEditor
                title="自己PR"
                status={selfPRDraft?.status}
                message={selfPRDraft?.message}
                refusalReason={selfPRDraft?.refusalReason}
                body={selfPRDraft?.result?.body ?? ""}
                onChange={(value) =>
                  selfPRDraft?.result
                    ? setSelfPRDraft({
                        ...selfPRDraft,
                        result: { ...selfPRDraft.result, body: value },
                      })
                    : undefined
                }
                suggestions={selfPRDraft?.result?.numericSuggestions ?? []}
              />
            </TabsContent>
            <TabsContent value="motivation">
              <DocumentEditor
                title="志望動機"
                status={motivationDraft?.status}
                message={motivationDraft?.message}
                refusalReason={motivationDraft?.refusalReason}
                body={motivationDraft?.result?.body ?? ""}
                onChange={(value) =>
                  motivationDraft?.result
                    ? setMotivationDraft({
                        ...motivationDraft,
                        result: { ...motivationDraft.result, body: value },
                      })
                    : undefined
                }
                suggestions={motivationDraft?.result?.customizationTips ?? []}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function DocumentEditor({
  title,
  status,
  message,
  refusalReason,
  body,
  onChange,
  extras,
  suggestions,
}: {
  title: string;
  status?: "success" | "refusal" | "error";
  message?: string;
  refusalReason?: string;
  body: string;
  onChange: (value: string) => void;
  extras?: React.ReactNode;
  suggestions?: string[];
}) {
  return (
    <Card className="rounded-[1.5rem] border-slate-200 bg-white shadow-none">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status && status !== "success" ? (
          <GenerationStatePanel status={status} message={message ?? ""} refusalReason={refusalReason} />
        ) : null}
        <Textarea value={body} onChange={(event) => onChange(event.target.value)} className="min-h-72 rounded-[1.5rem] bg-slate-50" />
        {suggestions?.length ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">数字を入れる提案</p>
            <ul className="space-y-2 text-sm text-slate-600">
              {suggestions.map((item) => (
                <li key={item} className="rounded-xl bg-slate-50 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {extras}
      </CardContent>
    </Card>
  );
}

function MetaCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="rounded-[1.25rem] border-slate-200 bg-slate-50 shadow-none">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-slate-600">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </CardContent>
    </Card>
  );
}
