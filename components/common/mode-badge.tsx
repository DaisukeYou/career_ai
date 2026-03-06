import { Badge } from "@/components/ui/badge";
import type { AppMode } from "@/lib/schemas/domain";

export function ModeBadge({ mode }: { mode: AppMode }) {
  return (
    <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/5 text-primary">
      {mode === "construction" ? "建築建設モード" : "一般モード"}
    </Badge>
  );
}
