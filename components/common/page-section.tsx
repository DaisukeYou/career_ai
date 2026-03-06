import type { ReactNode } from "react";

export function PageSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        {eyebrow ? <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase">{eyebrow}</p> : null}
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
        {description ? (
          <p className="max-w-3xl text-base leading-7 text-slate-600">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
