"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { generateProfileAction } from "@/app/actions/interview";
import { GenerationStatePanel } from "@/components/common/generation-state-panel";
import { SaveStatus } from "@/components/common/save-status";
import { SensitiveDataNote } from "@/components/common/sensitive-data-note";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { getConstructionBranchFromAnswers, getInterviewSteps } from "@/lib/constants/app";
import { useCareerSessionStore } from "@/lib/store/session";
import { selectCurrentInterviewProgress } from "@/lib/store/session";

export function InterviewPage() {
  const router = useRouter();
  const {
    mode,
    quickAssessment,
    quickAssessmentInput,
    interviewAnswers,
    setInterviewAnswer,
    skipInterviewAnswer,
    setGeneratedProfile,
    markSaved,
    lastSavedAt,
  } = useCareerSessionStore();
  const [index, setIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [generationError, setGenerationError] = useState<{
    status: "success" | "refusal" | "error";
    message: string;
    refusalReason?: string;
  } | null>(null);

  const branch = getConstructionBranchFromAnswers(interviewAnswers);
  const steps = useMemo(() => getInterviewSteps(mode, branch), [mode, branch]);
  const currentStep = steps[index];
  const progress = selectCurrentInterviewProgress({ interviewAnswers } as never, steps.length);
  const currentAnswer =
    interviewAnswers.find((answer) => answer.questionId === currentStep.id)?.answer ?? "";

  if (!quickAssessment) {
    return (
      <Card className="rounded-[2rem] border-white/70 bg-white/85 shadow-none">
        <CardContent className="py-8">
          <p className="text-sm text-slate-600">先に1分診断を完了すると、面談の流れが軽くなります。</p>
          <Button className="mt-4 rounded-full" onClick={() => router.push("/diagnosis")}>
            1分診断へ戻る
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!currentStep) {
    return null;
  }

  const moveNext = () => {
    setIndex((value) => Math.min(value + 1, steps.length - 1));
  };

  const saveAndNext = () => {
    setInterviewAnswer({
      questionId: currentStep.id,
      question: currentStep.prompt,
      answer: currentAnswer,
      skipped: false,
    });
    markSaved();
    moveNext();
  };

  const onFinish = () => {
    setSubmitting(true);
    startTransition(async () => {
      const answers = interviewAnswers.some((answer) => answer.questionId === currentStep.id)
        ? interviewAnswers
        : [
            ...interviewAnswers,
            {
              questionId: currentStep.id,
              question: currentStep.prompt,
              answer: currentAnswer,
              skipped: false,
            },
          ];

      const profile = await generateProfileAction({
        mode,
        quickAssessment:
          quickAssessmentInput ?? {
            currentRole: "",
            desiredRole: "",
            preferredLocation: "",
            salaryRange: "300万〜400万円",
            currentWorry: "書類に自信がない",
            mode,
          },
        answers,
      });
      setSubmitting(false);

      if (profile.status !== "success") {
        setGenerationError(profile);
        return;
      }

      setGeneratedProfile(profile);
      router.push("/profile");
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
      <Card className="rounded-[2rem] border-white/70 bg-white/85 shadow-none">
        <CardHeader className="space-y-4">
          <PageHeader
            mode={mode}
            title="5分AI面談"
            description="1問ずつ答えるだけで、プロフィールの芯を整理します。スキップしても進められます。"
          />
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>進捗</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <SaveStatus savedAt={lastSavedAt} />
          <SensitiveDataNote />
          <div className="space-y-2 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">現在の質問</p>
            <p className="text-base font-medium text-slate-900">{currentStep.label}</p>
            <p className="text-sm leading-6 text-slate-600">{currentStep.prompt}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-white/70 bg-white/85 shadow-none">
        <CardHeader>
          <CardTitle>面談入力</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {generationError ? (
            <GenerationStatePanel
              status={generationError.status}
              message={generationError.message}
              refusalReason={generationError.refusalReason}
              onRetry={() => setGenerationError(null)}
            />
          ) : null}
          <Textarea
            aria-label={currentStep.label}
            value={currentAnswer}
            onChange={(event) =>
              setInterviewAnswer({
                questionId: currentStep.id,
                question: currentStep.prompt,
                answer: event.target.value,
                skipped: false,
              })
            }
            placeholder={currentStep.placeholder}
            className="min-h-56 rounded-[1.5rem] border-white bg-slate-50 text-base"
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => {
                skipInterviewAnswer(currentStep.id, currentStep.prompt);
                markSaved();
                moveNext();
              }}
            >
              スキップ
            </Button>
            <div className="flex flex-col gap-3 sm:flex-row">
              {index < steps.length - 1 ? (
                <Button type="button" className="rounded-full bg-emerald-900 text-white hover:bg-emerald-950" onClick={saveAndNext}>
                  次へ
                </Button>
              ) : (
                <Button
                  type="button"
                  className="rounded-full bg-emerald-900 text-white hover:bg-emerald-950"
                  disabled={submitting}
                  onClick={onFinish}
                >
                  {submitting ? "プロフィールを作成中..." : "プロフィールを作成する"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
