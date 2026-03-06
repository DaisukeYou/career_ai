"use client";

import { startTransition, useState } from "react";

import { generateOfferReviewAction } from "@/app/actions/offer-review";
import { GenerationStatePanel } from "@/components/common/generation-state-panel";
import { LegalDisclaimerAlert } from "@/components/common/legal-disclaimer-alert";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { OFFER_REVIEW_DISCLAIMER } from "@/lib/constants/app";
import { useCareerSessionStore } from "@/lib/store/session";

export function OfferReviewPage() {
  const { mode, offerReview, offerReviewRawText, setOfferReview, setOfferReviewRawText } =
    useCareerSessionStore();
  const [pending, setPending] = useState(false);

  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <Card className="rounded-[2rem] border-white/70 bg-white/85 shadow-none">
        <CardHeader className="space-y-4">
          <PageHeader
            mode={mode}
            title="条件通知レビュー"
            description="法的判断ではなく、確認したい論点を整理するための画面です。"
          />
          <LegalDisclaimerAlert text={OFFER_REVIEW_DISCLAIMER} />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600">
            PDFや画像アップロードは今後対応予定です。初版では、条件通知の文面をテキストで貼り付けてください。
          </p>
          <Textarea
            value={offerReviewRawText}
            onChange={(event) => setOfferReviewRawText(event.target.value)}
            placeholder="例: 想定年収420万円、月給35万円(固定残業45時間分を含む)..."
            className="min-h-72 rounded-[1.5rem] bg-slate-50"
          />
          <Button
            type="button"
            className="rounded-full bg-emerald-900 text-white hover:bg-emerald-950"
            disabled={pending}
            onClick={() => {
              setPending(true);
              startTransition(async () => {
                const result = await generateOfferReviewAction({
                  rawText: offerReviewRawText,
                  sourceType: "text",
                  mode,
                });
                setOfferReview(result);
                setPending(false);
              });
            }}
          >
            {pending ? "確認論点を整理中..." : "確認論点を整理する"}
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-white/70 bg-white/85 shadow-none">
        <CardHeader>
          <CardTitle>レビュー結果</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {pending ? <LoadingSkeleton lines={10} /> : null}
          {offerReview ? (
            <>
              <GenerationStatePanel
                status={offerReview.status}
                message={offerReview.message}
                refusalReason={offerReview.refusalReason}
              />
              {offerReview.result ? (
                <>
                  <div className="grid gap-5 md:grid-cols-2">
                    <InfoBlock title="基本条件一覧">
                      {offerReview.result.basicTerms.map((item) => (
                        <p key={item.label} className="text-sm text-slate-600">
                          <strong className="text-slate-900">{item.label}:</strong> {item.value} ({item.confidence})
                        </p>
                      ))}
                    </InfoBlock>
                    <InfoBlock title="信頼度">
                      <p className="text-sm text-slate-600">overallConfidence: {offerReview.result.overallConfidence}</p>
                      <p className="text-sm text-slate-600">
                        needsHumanReview: {offerReview.result.needsHumanReview ? "はい" : "いいえ"}
                      </p>
                    </InfoBlock>
                  </div>
                  <InfoBlock title="赤旗の可能性がある論点">
                    {offerReview.result.redFlagPoints.map((item) => (
                      <p key={item} className="text-sm text-slate-600">
                        {item}
                      </p>
                    ))}
                  </InfoBlock>
                  <InfoBlock title="不足情報">
                    {offerReview.result.missingInfo.map((item) => (
                      <p key={item} className="text-sm text-slate-600">
                        {item}
                      </p>
                    ))}
                  </InfoBlock>
                  <InfoBlock title="面接・内定後に確認すべき質問">
                    {offerReview.result.checkQuestions.map((item) => (
                      <p key={item} className="text-sm text-slate-600">
                        {item}
                      </p>
                    ))}
                  </InfoBlock>
                  <InfoBlock title="交渉時の文面下書き">
                    <p className="text-sm leading-7 text-slate-600">{offerReview.result.negotiationDraft}</p>
                  </InfoBlock>
                </>
              ) : null}
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-[1.5rem] border-slate-200 bg-slate-50 shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}
