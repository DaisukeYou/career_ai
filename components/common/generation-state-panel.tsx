"use client";

import { AlertTriangle, Ban, CircleAlert, RefreshCcw } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { GenerationStatus } from "@/lib/schemas/domain";

type Props = {
  status: GenerationStatus;
  message: string;
  refusalReason?: string;
  warnings?: string[];
  retryLabel?: string;
  onRetry?: () => void;
};

export function GenerationStatePanel({
  status,
  message,
  refusalReason,
  warnings,
  retryLabel = "再試行する",
  onRetry,
}: Props) {
  if (status === "ok") return null;

  const Icon =
    status === "refusal" ? Ban : status === "partial" ? CircleAlert : AlertTriangle;
  const title =
    status === "refusal"
      ? "入力の補足が必要です"
      : status === "partial"
        ? "一部補足すると精度が上がります"
        : "生成に失敗しました";
  const className =
    status === "partial"
      ? "border-sky-200 bg-sky-50 text-sky-950"
      : "border-amber-200 bg-amber-50 text-amber-950";

  return (
    <Alert className={className}>
      <Icon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>{message}</p>
        {refusalReason ? <p className="text-sm text-amber-900/80">{refusalReason}</p> : null}
        {warnings?.length ? (
          <ul className="space-y-1 text-sm">
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        ) : null}
        {onRetry ? (
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            {retryLabel}
          </Button>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}
