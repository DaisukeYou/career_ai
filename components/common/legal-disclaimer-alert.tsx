import { ShieldAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function LegalDisclaimerAlert({ text }: { text: string }) {
  return (
    <Alert className="border-sky-200 bg-sky-50 text-sky-950">
      <ShieldAlert className="h-4 w-4" />
      <AlertTitle>確認論点の整理支援です</AlertTitle>
      <AlertDescription>{text}</AlertDescription>
    </Alert>
  );
}
