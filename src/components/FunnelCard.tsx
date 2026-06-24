"use client";

import { useDashboard } from "./DashboardProvider";
import { formatNumber } from "@/lib/format";

export default function FunnelCard() {
  const { data } = useDashboard();
  const steps = [
    { label: "노출", value: data.totals.impressions, color: "bg-indigo-500" },
    { label: "클릭", value: data.totals.clicks, color: "bg-emerald-500" },
    { label: "랜딩조회", value: data.conversions.landingViews, color: "bg-sky-500" },
    { label: "전환(구매)", value: data.totals.conversions, color: "bg-rose-500" },
  ];
  const max = steps[0].value || 1;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-3 text-base font-bold text-slate-900 dark:text-white">전환 퍼널</h2>
      <div className="space-y-2.5">
        {steps.map((s) => (
          <div key={s.label}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">{s.label}</span>
              <span className="font-semibold tabular-nums text-slate-700 dark:text-slate-200">{formatNumber(s.value)}</span>
            </div>
            <div className="h-4 rounded bg-slate-100 dark:bg-slate-800">
              <div className={`h-full rounded ${s.color}`} style={{ width: `${Math.max(2, (s.value / max) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
      {data.totals.conversions === 0 && (
        <p className="mt-3 text-[11px] text-amber-600 dark:text-amber-400">클릭→전환 0% · 픽셀/랜딩 점검 필요</p>
      )}
    </div>
  );
}
