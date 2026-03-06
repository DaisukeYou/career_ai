"use client";

import { CheckCircle2 } from "lucide-react";

export function SaveStatus({ savedAt }: { savedAt?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
      <span>
        {savedAt
          ? `この端末に保存済み ${new Date(savedAt).toLocaleTimeString("ja-JP", {
              hour: "2-digit",
              minute: "2-digit",
            })}`
          : "この端末に途中経過を保存します"}
      </span>
    </div>
  );
}
