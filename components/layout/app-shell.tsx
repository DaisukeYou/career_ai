import type { ReactNode } from "react";
import Link from "next/link";

import { ProgressStepper } from "@/components/common/progress-stepper";
import { APP_NAME } from "@/lib/constants/app";

export function AppShell({
  children,
  showProgress = true,
}: {
  children: ReactNode;
  showProgress?: boolean;
}) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f4ee_0%,#fcfbf8_35%,#f8fbf8_100%)] text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-900 text-lg font-semibold text-white">
              転
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-900">AIと話すだけで前進する</p>
              <p className="text-lg font-semibold tracking-tight">{APP_NAME}</p>
            </div>
          </Link>
          {showProgress ? <ProgressStepper /> : null}
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
