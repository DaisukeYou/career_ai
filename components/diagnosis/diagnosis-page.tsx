"use client";

import { startTransition, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useWatch } from "react-hook-form";

import { generateQuickAssessmentAction } from "@/app/actions/quick-assessment";
import { EmptyState } from "@/components/common/empty-state";
import { GenerationStatePanel } from "@/components/common/generation-state-panel";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { salaryRanges, sampleDiagnostics, worryOptions } from "@/lib/constants/app";
import { useCareerSessionStore } from "@/lib/store/session";
import type { QuickAssessmentInput } from "@/lib/schemas/domain";
import { quickAssessmentInputSchema } from "@/lib/schemas/domain";

export function DiagnosisPage() {
  const [pending, setPending] = useState(false);
  const {
    mode,
    quickAssessment,
    setMode,
    setQuickAssessmentInput,
    setQuickAssessment,
    loadSample,
  } =
    useCareerSessionStore();
  const form = useForm<QuickAssessmentInput>({
    defaultValues: {
      currentRole: "",
      desiredRole: "",
      preferredLocation: "",
      salaryRange: "300万〜400万円",
      currentWorry: "書類に自信がない",
      mode,
    },
  });
  const watchedMode = useWatch({ control: form.control, name: "mode" });

  const result = quickAssessment;

  const onSubmit = form.handleSubmit((values) => {
    const parsed = quickAssessmentInputSchema.safeParse(values);
    if (!parsed.success) {
      form.setError("currentRole", {
        message: parsed.error.issues[0]?.message,
      });
      return;
    }
    setMode(values.mode);
    setQuickAssessmentInput(values);
    setPending(true);
    startTransition(async () => {
      const generated = await generateQuickAssessmentAction(values);
      setQuickAssessment(generated);
      setPending(false);
    });
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="rounded-[2rem] border-white/70 bg-white/85 shadow-none">
        <CardHeader>
          <PageHeader
            mode={watchedMode}
            title="1分診断"
            description="最小限の入力だけで、仮の強みと次の一歩を整理します。"
          />
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currentRole">現職または直近職種</Label>
                <Input id="currentRole" {...form.register("currentRole")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desiredRole">希望職種</Label>
                <Input id="desiredRole" {...form.register("desiredRole")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredLocation">希望勤務地</Label>
                <Input id="preferredLocation" {...form.register("preferredLocation")} />
              </div>
              <div className="space-y-2">
                <Label>年収レンジ</Label>
                <Select
                  defaultValue={form.getValues("salaryRange")}
                  onValueChange={(value) => form.setValue("salaryRange", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {salaryRanges.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>現在の悩み</Label>
                <Select
                  defaultValue={form.getValues("currentWorry")}
                  onValueChange={(value) =>
                    form.setValue("currentWorry", value as QuickAssessmentInput["currentWorry"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {worryOptions.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>モード</Label>
                <Select
                  defaultValue={form.getValues("mode")}
                  onValueChange={(value) => {
                    form.setValue("mode", value as QuickAssessmentInput["mode"]);
                    setMode(value as QuickAssessmentInput["mode"]);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">一般</SelectItem>
                    <SelectItem value="construction">建築建設</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {Object.values(form.formState.errors).length ? (
              <p className="text-sm text-red-600">未入力項目があります。埋めてから進んでください。</p>
            ) : null}

            <Button type="submit" size="lg" className="rounded-full bg-emerald-900 px-6 text-white hover:bg-emerald-950" disabled={pending}>
              1分診断を実行する
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="rounded-[2rem] border-white/70 bg-white/80 shadow-none">
          <CardHeader>
            <CardTitle>サンプルを読み込む</CardTitle>
            <CardDescription>若手転職と建築建設の体験をすぐ試せます。</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {Object.entries(sampleDiagnostics).map(([id, sample]) => (
              <Button
                key={id}
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  loadSample(id);
                  form.reset(sample);
                  setQuickAssessmentInput(sample);
                }}
              >
                {sample.currentRole}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-white/70 bg-white/85 shadow-none">
          <CardHeader>
            <CardTitle>診断結果</CardTitle>
            <CardDescription>約1分で、次の一歩が見える設計です。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {pending ? <LoadingSkeleton lines={8} /> : null}
            {result ? (
              <>
                <GenerationStatePanel
                  status={result.status}
                  message={result.message}
                  refusalReason={result.refusalReason}
                  onRetry={() => onSubmit()}
                />
                {result.status === "success" && result.result ? (
                  <div className="space-y-5">
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-slate-500">仮の強みタグ</p>
                      <div className="flex flex-wrap gap-2">
                        {result.result.strengthTags.map((tag) => (
                          <Badge key={tag} className="rounded-full bg-emerald-100 text-emerald-900 hover:bg-emerald-100">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <DiagnosisList title="おすすめの次アクション" items={result.result.nextActions} />
                    <DiagnosisList title="書類化すると良くなる項目" items={result.result.improvementPoints} />
                    <p className="text-sm leading-7 text-slate-600">{result.result.summary}</p>
                    <Button asChild size="lg" className="w-full rounded-full bg-emerald-900 text-white hover:bg-emerald-950">
                      <Link href="/interview">5分AI面談で書類のたたき台を作る</Link>
                    </Button>
                  </div>
                ) : null}
              </>
            ) : pending ? null : (
              <EmptyState
                title="まだ診断前です"
                description="入力を終えると、仮の強みと次アクションがここに表示されます。"
                href="/diagnosis"
                cta="このまま入力する"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DiagnosisList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <ul className="space-y-2 text-sm leading-7 text-slate-700">
        {items.map((item) => (
          <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
