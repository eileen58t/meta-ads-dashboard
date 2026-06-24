"use client";

import { useDashboard } from "./DashboardProvider";
import { rankCreatives } from "@/lib/analytics";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";

export default function CreativePanel() {
  const { data } = useDashboard();
  const ranked = rankCreatives(data.creatives);
  const maxSpend = Math.max(...ranked.map((c) => c.spend), 1);
  const best = ranked[0];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">소재별 성과</h2>
        <span className="text-xs text-slate-400">CTR 순 · {data.creatives.length}개 소재</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs text-slate-400 dark:border-slate-700">
              <th className="py-1.5 text-left font-medium">소재</th>
              <th className="py-1.5 text-right font-medium">지출</th>
              <th className="py-1.5 text-right font-medium">노출</th>
              <th className="py-1.5 text-right font-medium">클릭</th>
              <th className="py-1.5 text-right font-medium">CTR</th>
              <th className="py-1.5 text-right font-medium">CPC</th>
              <th className="py-1.5 text-right font-medium">결과</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((c) => (
              <tr key={c.id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`rounded px-1 py-0.5 text-[10px] ${
                      c.type === "영상"
                        ? "bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300"
                        : "bg-sky-100 text-sky-600 dark:bg-sky-950/50 dark:text-sky-300"
                    }`}>{c.type}</span>
                    <span className="truncate text-slate-700 dark:text-slate-200">{c.name}</span>
                    {c === best && (
                      <span className="rounded bg-emerald-100 px-1 py-0.5 text-[10px] text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">베스트</span>
                    )}
                  </div>
                  <div className="mt-1 h-1.5 rounded bg-slate-100 dark:bg-slate-800">
                    <div className="h-full rounded bg-indigo-500/70" style={{ width: `${(c.spend / maxSpend) * 100}%` }} />
                  </div>
                </td>
                <td className="py-2 text-right tabular-nums text-slate-700 dark:text-slate-200">{formatCurrency(c.spend)}</td>
                <td className="py-2 text-right tabular-nums text-slate-500 dark:text-slate-400">{formatNumber(c.impressions)}</td>
                <td className="py-2 text-right tabular-nums text-slate-500 dark:text-slate-400">{formatNumber(c.clicks)}</td>
                <td className="py-2 text-right font-semibold tabular-nums text-slate-900 dark:text-white">{formatPercent(c.ctr)}</td>
                <td className="py-2 text-right tabular-nums text-slate-500 dark:text-slate-400">{formatCurrency(c.cpc)}</td>
                <td className="py-2 text-right text-xs text-slate-400">{c.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
        영상 소재가 이미지보다 CTR이 높은 경향 · 상단 KPI 카드를 누르면 지표별 소재 상세를 볼 수 있습니다.
      </p>
    </div>
  );
}
