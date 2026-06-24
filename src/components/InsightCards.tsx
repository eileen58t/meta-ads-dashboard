"use client";

import { useDashboard } from "./DashboardProvider";
import { insights } from "@/lib/analytics";
import { formatCurrency, formatPercent } from "@/lib/format";

function MiniList({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="space-y-1">
      {rows.map((r) => (
        <div key={r.label} className="flex justify-between text-[11px]">
          <span className="text-slate-500 dark:text-slate-400">{r.label}</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function InsightCards() {
  const { data } = useDashboard();
  const ins = insights(data);
  const cpcMin = [...data.segments.platform].filter((p) => p.cpc !== null).sort((a, b) => (a.cpc ?? 0) - (b.cpc ?? 0))[0];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs text-slate-500 dark:text-slate-400">CTR 인사이트</p>
        <p className="mt-0.5 text-lg font-bold text-slate-900 dark:text-white">{formatPercent(data.totals.ctr)}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          영상 5.35% &gt; 이미지 3.01%<br />베스트 65+ 8.15%
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs text-slate-500 dark:text-slate-400">CPC 인사이트</p>
        <p className="mt-0.5 text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(data.totals.cpc)}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          최저 {cpcMin?.label} {formatCurrency(cpcMin?.cpc ?? null)}<br />최고 우리밀 판매 ₩1,391
        </p>
      </div>
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/20">
        <p className="mb-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">▲ 베스트</p>
        <MiniList rows={ins.best} />
      </div>
      <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 shadow-sm dark:border-rose-900/50 dark:bg-rose-950/20">
        <p className="mb-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">▼ 워스트</p>
        <MiniList rows={ins.worst} />
      </div>
    </div>
  );
}
