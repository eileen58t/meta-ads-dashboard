"use client";

import { useDashboard } from "./DashboardProvider";
import { actions as computeActions, diagnosis as computeDiagnosis } from "@/lib/analytics";

const ICONS: Record<string, string> = { video: "🎬", target: "🎯", flask: "🧪", bug: "🐞" };

export default function AiAnalysis() {
  const { data } = useDashboard();
  const acts = computeActions(data);
  const diag = computeDiagnosis(data);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-sm text-white">AI</span>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">분석 · 추천 액션</h2>
        <span className="text-xs text-slate-400 dark:text-slate-500">· 데이터 자동 계산</span>
      </div>

      <div className="mb-5 rounded-lg bg-indigo-50 p-4 dark:bg-indigo-950/40">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500 dark:text-indigo-400">핵심 진단</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-800 dark:text-slate-100">{diag}</p>
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">무엇을 해야 하나</p>
      <ol className="space-y-3">
        {acts.map((a, i) => (
          <li key={i} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <p className="flex items-start gap-2 font-semibold text-slate-900 dark:text-white">
              <span className="text-base leading-5" aria-hidden>{ICONS[a.icon] ?? "•"}</span>
              {a.title}
            </p>
            <p className="mt-1.5 pl-7 text-sm text-slate-600 dark:text-slate-300">{a.reason}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
