"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { progressLabels } from "@/lib/constants/app";
import { cn } from "@/lib/utils";

export function ProgressStepper() {
  const pathname = usePathname();

  return (
    <nav aria-label="画面進捗" className="overflow-x-auto pb-2">
      <ol className="flex min-w-max items-center gap-3">
        {progressLabels.map((item, index) => {
          const active = pathname === item.href;
          const passed = progressLabels.findIndex((step) => step.href === pathname) >= index;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors",
                  active && "border-primary bg-primary text-primary-foreground",
                  !active && passed && "border-primary/20 bg-primary/10 text-primary",
                  !passed && "border-border bg-white/70 text-muted-foreground",
                )}
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/5 text-xs">
                  {index + 1}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
