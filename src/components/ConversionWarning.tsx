"use client";

import { useDashboard } from "./DashboardProvider";
import { CONVERSION_EVENT_LABELS, CONVERSION_DEFINITION } from "@/lib/data";
import { formatCurrency, formatNumber } from "@/lib/format";

export default function ConversionWarning() {
  const { data } = useDashboard();
  const positive = data.totals.conversions > 0;
  const tone = positive
    ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800/60 dark:bg-emerald-950/30"
    : "border-amber-300 bg-amber-50 dark:border-amber-800/60 dark:bg-amber-950/30";
  const text = positive ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300";

  return (
    <div className={`rounded-xl border p-4 ${tone}`}>
      <div className="flex items-baseline justify-between gap-2">
        <span className={`text-sm font-semibold ${text}`}>
          {positive ? "✓" : "⚠"} 전환 / 전환가치
        </span>
        <span className={`text-lg font-bold ${text}`}>
          {formatNumber(data.totals.conversions)}건 / {formatCurrency(data.totals.conversionValue)}
        </span>
      </div>
      <p className={`mt-1 text-[11px] ${text} opacity-80`}>{CONVERSION_DEFINITION}</p>

      <div className="mt-2 grid grid-cols-3 gap-2">
        {CONVERSION_EVENT_LABELS.map((ev) => {
          const e = data.conversions.events[ev.key];
          return (
            <div key={ev.key} className="rounded-lg bg-white/50 px-2 py-1.5 dark:bg-black/20">
              <p className={`text-[11px] ${text} opacity-80`}>{ev.label}</p>
              <p className={`text-sm font-semibold ${text}`}>
                {formatNumber(e.count)}건
                <span className="ml-1 text-[11px] font-normal opacity-70">{formatCurrency(e.value)}</span>
              </p>
            </div>
          );
        })}
      </div>

      {!positive && (
        <p className={`mt-2 text-xs leading-relaxed ${text} opacity-90`}>
          클릭 {formatNumber(data.totals.clicks)} · 랜딩조회 {formatNumber(data.conversions.landingViews)}건은 발생했지만 세 전환 이벤트 모두 0 → 픽셀 이벤트·전환 추적 연결 점검 필요
        </p>
      )}
    </div>
  );
}
