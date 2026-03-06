import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, FileStack, Landmark, MessageCircleMore, Sparkles } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "診断",
    description: "まずは1分で、強みと次アクションを見える化。",
    icon: Sparkles,
  },
  {
    title: "AI面談",
    description: "5分の会話で書類の芯になる情報を整理。",
    icon: MessageCircleMore,
  },
  {
    title: "書類作成",
    description: "履歴書・職務経歴書・自己PRのたたき台までつなげる。",
    icon: FileStack,
  },
  {
    title: "面接準備",
    description: "想定質問、回答の下書き、逆質問までカバー。",
    icon: BriefcaseBusiness,
  },
  {
    title: "条件通知レビュー",
    description: "要確認ポイントと確認質問を整理。",
    icon: Landmark,
  },
];

export function LandingPage() {
  return (
    <AppShell showProgress={false}>
      <div className="space-y-16 pb-16">
        <section className="grid gap-10 rounded-[2rem] border border-white/60 bg-white/75 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-8">
            <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-900 hover:bg-emerald-100">
              日本向け転職準備のMVP
            </Badge>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-slate-950">
                AIと話すだけで、転職の準備が前に進む
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                履歴書・職務経歴書のたたき台、面接準備、条件確認までサポート。重い登録なしで、まず一歩前に進めます。
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full bg-emerald-900 px-7 text-white hover:bg-emerald-950">
                <Link href="/diagnosis">
                  1分診断を始める
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            <Card className="rounded-[1.75rem] border-0 bg-slate-950 text-white shadow-none">
              <CardHeader>
                <CardTitle className="text-2xl">若手転職</CardTitle>
                <CardDescription className="text-slate-300">
                  第二新卒〜若手の営業、CS、事務系転職に対応。
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-slate-200">
                今の経験をどう見せるか、どの職種に広げられるかを短時間で整理します。
              </CardContent>
            </Card>
            <Card className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 shadow-none">
              <CardHeader>
                <CardTitle className="text-2xl text-emerald-950">建築建設</CardTitle>
                <CardDescription className="text-emerald-900/80">
                  施工管理、設計、積算、CAD/BIM、職人系に切り替え。
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-emerald-950/80">
                案件種別、構造、資格、ソフト、働き方まで業界特化で整理します。
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {features.map((feature) => (
            <Card key={feature.title} className="rounded-[1.5rem] border-white/70 bg-white/80 shadow-none">
              <CardHeader className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
