"use client";

import { AlertTriangle, Ban, RefreshCcw } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { GenerationStatus } from "@/lib/schemas/domain";

type Props = {
  status: GenerationStatus;
  message: string;
  refusalReason?: string;
  retryLabel?: string;
  onRetry?: () => void;
};

export function GenerationStatePanel({
  status,
  message,
  refusalReason,
  retryLabel = "再試行する",
  onRetry,
}: Props) {
  if (status === "success") return null;

  const Icon = status === "refusal" ? Ban : AlertTriangle;
  const title = status === "refusal" ? "入力の補足が必要です" : "生成に失敗しました";

  return (
    <Alert className="border-amber-200 bg-amber-50 text-amber-950">
      <Icon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>{message}</p>
        {refusalReason ? <p className="text-sm text-amber-900/80">{refusalReason}</p> : null}
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
