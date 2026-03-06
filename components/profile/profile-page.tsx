"use client";

import Link from "next/link";

import { EmptyState } from "@/components/common/empty-state";
import { GenerationStatePanel } from "@/components/common/generation-state-panel";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCareerSessionStore } from "@/lib/store/session";

export function ProfilePage() {
  const { generatedProfile, mode } = useCareerSessionStore();

  if (!generatedProfile) {
    return (
      <EmptyState
        title="プロフィールはまだ作成されていません"
        description="5分AI面談を完了すると、強み・懸念点・転職軸が整理されます。"
        href="/interview"
        cta="AI面談へ進む"
      />
    );
  }

  return (
    <div className="space-y-8">
      <Card className="rounded-[2rem] border-white/70 bg-white/85 shadow-none">
        <CardHeader className="space-y-4">
          <PageHeader
            mode={mode}
            title="面談結果"
            description="まずはプロフィール要約を先に返し、必要なものだけ次に広げる設計です。"
          />
          <GenerationStatePanel
            status={generatedProfile.status}
            message={generatedProfile.message}
            refusalReason={generatedProfile.refusalReason}
          />
        </CardHeader>
        {generatedProfile.result ? (
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-500">プロフィール要約</p>
              <h2 className="text-2xl font-semibold tracking-tight">{generatedProfile.result.headline}</h2>
              <p className="max-w-4xl text-base leading-7 text-slate-600">{generatedProfile.result.summary}</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <ProfileCard title="強み" items={generatedProfile.result.strengths} />
              <ProfileCard title="懸念点" items={generatedProfile.result.concerns} />
              <ProfileCard title="転職軸" items={generatedProfile.result.careerAnchors} />
              <ProfileCard title="推奨職種" items={generatedProfile.result.recommendedRoles} />
            </div>
            <Card className="rounded-[1.5rem] border-slate-200 bg-slate-50 shadow-none">
              <CardHeader>
                <CardTitle>書類の完成度メーター</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>現在地</span>
                  <span>{generatedProfile.result.completionScore}%</span>
                </div>
                <Progress value={generatedProfile.result.completionScore} />
                <div className="flex flex-wrap gap-2">
                  {generatedProfile.result.evidenceGaps.map((gap) => (
                    <Badge key={gap} variant="outline" className="rounded-full bg-white">
                      追加すると強くなる: {gap}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full bg-emerald-900 text-white hover:bg-emerald-950">
                <Link href="/documents">履歴書のたたき台を見る</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link href="/interview-prep">面接準備を作る</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="rounded-full">
                <Link href="/interview">深掘りして精度を上げる</Link>
              </Button>
            </div>
          </CardContent>
        ) : null}
      </Card>
    </div>
  );
}

function ProfileCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="rounded-[1.5rem] border-slate-200 bg-white shadow-none">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm leading-6 text-slate-600">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
