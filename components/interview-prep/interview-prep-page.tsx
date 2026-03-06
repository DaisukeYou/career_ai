"use client";

import { useEffect, useTransition } from "react";

import { generateInterviewPrepAction } from "@/app/actions/interview-prep";
import { EmptyState } from "@/components/common/empty-state";
import { GenerationStatePanel } from "@/components/common/generation-state-panel";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCareerSessionStore } from "@/lib/store/session";

export function InterviewPrepPage() {
  const {
    mode,
    quickAssessmentInput,
    interviewAnswers,
    generatedProfile,
    interviewPrep,
    setInterviewPrep,
  } = useCareerSessionStore();
  const [pending, startGeneration] = useTransition();

  useEffect(() => {
    if (!quickAssessmentInput || !generatedProfile || interviewPrep) return;
    startGeneration(async () => {
      const result = await generateInterviewPrepAction({
        mode,
        quickAssessment: quickAssessmentInput,
        answers: interviewAnswers,
        profile: generatedProfile,
      });
      setInterviewPrep(result);
    });
  }, [
    generatedProfile,
    interviewAnswers,
    interviewPrep,
    mode,
    quickAssessmentInput,
    setInterviewPrep,
    startGeneration,
  ]);

  if (!generatedProfile || !quickAssessmentInput) {
    return (
      <EmptyState
        title="面接準備はまだありません"
        description="面談結果があると、想定質問と回答のたたき台を作れます。"
        href="/profile"
        cta="面談結果へ戻る"
      />
    );
  }

  return (
    <div className="space-y-8">
      <Card className="rounded-[2rem] border-white/70 bg-white/85 shadow-none">
        <CardHeader>
          <PageHeader
            mode={mode}
            title="面接準備"
            description="想定質問、回答のたたき台、逆質問までまとめて整理します。"
          />
        </CardHeader>
        <CardContent className="space-y-5">
          {pending ? <LoadingSkeleton lines={10} /> : null}
          {interviewPrep ? (
            <>
              <GenerationStatePanel
                status={interviewPrep.status}
                message={interviewPrep.message}
                refusalReason={interviewPrep.refusalReason}
              />
              {interviewPrep.result ? (
                <>
                  <div className="grid gap-5">
                    {interviewPrep.result.expectedQuestions.map((item) => (
                      <Card key={item.question} className="rounded-[1.5rem] border-slate-200 bg-white shadow-none">
                        <CardHeader>
                          <CardTitle className="text-lg">{item.question}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm leading-7 text-slate-600">
                          <p>
                            <strong className="text-slate-900">意図:</strong> {item.intent}
                          </p>
                          <p>
                            <strong className="text-slate-900">回答たたき台:</strong> {item.draftAnswer}
                          </p>
                          {item.starRewrite ? (
                            <p>
                              <strong className="text-slate-900">STAR整形:</strong> {item.starRewrite}
                            </p>
                          ) : null}
                          {item.weakPoint ? (
                            <p>
                              <strong className="text-slate-900">弱いポイント:</strong> {item.weakPoint}
                            </p>
                          ) : null}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="grid gap-5 lg:grid-cols-2">
                    <InfoCard title="逆質問" items={interviewPrep.result.reverseQuestions} />
                    <InfoCard title="コーチングメモ" items={interviewPrep.result.coachingNotes} />
                  </div>
                  {interviewPrep.result.constructionTips?.length ? (
                    <InfoCard title="建築建設向けの話し方" items={interviewPrep.result.constructionTips} />
                  ) : null}
                </>
              ) : null}
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="rounded-[1.5rem] border-slate-200 bg-slate-50 shadow-none">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm leading-7 text-slate-600">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </CardContent>
    </Card>
  );
}
