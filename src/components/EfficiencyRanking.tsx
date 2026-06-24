"use client";

import { useDashboard } from "./DashboardProvider";
import { rankAdsets } from "@/lib/analytics";
import { formatCurrency, formatPercent } from "@/lib/format";

export default function EfficiencyRanking() {
  const { data } = useDashboard();
  const ranked = rankAdsets(data.adsets);
  const best = ranked[0];
  const worst = ranked[ranked.length - 1];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-3 text-base font-bold text-slate-900 dark:text-white">
        광고세트 효율 순위 <span className="text-xs font-normal text-slate-400">CTR 기준</span>
      </h2>
      <ul className="space-y-1.5">
        {ranked.map((a, i) => {
          const tone = a === best
            ? "text-emerald-600 dark:text-emerald-400"
            : a === worst
              ? "text-rose-600 dark:text-rose-400"
              : "text-slate-500 dark:text-slate-400";
          return (
            <li key={`${a.name}-${i}`} className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5 text-xs last:border-0 dark:border-slate-800">
              <span className="flex items-center gap-1.5 truncate text-slate-600 dark:text-slate-300">
                <span className={`shrink-0 rounded px-1 py-0.5 text-[10px] ${
                  a.objective === "트래픽"
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}>{a.objective}</span>
                <span className="truncate">{a.name}</span>
              </span>
              <span className="shrink-0 tabular-nums text-slate-500 dark:text-slate-400">
                {formatCurrency(a.spend)} · <span className={`font-semibold ${tone}`}>{formatPercent(a.ctr)}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
