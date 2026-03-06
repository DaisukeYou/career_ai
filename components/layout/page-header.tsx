import { ModeBadge } from "@/components/common/mode-badge";
import type { AppMode } from "@/lib/schemas/domain";

export function PageHeader({
  mode,
  title,
  description,
}: {
  mode?: AppMode;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-3">
      {mode ? <ModeBadge mode={mode} /> : null}
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
      <p className="max-w-3xl text-base leading-7 text-slate-600">{description}</p>
    </div>
  );
}
