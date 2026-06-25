"use client";

import { useState } from "react";
import { useDashboard } from "./DashboardProvider";
import {
  deltas as computeDeltas,
  sparks as computeSparks,
  rankCreatives,
  creativeMetric,
  KpiKey,
  Delta,
} from "@/lib/analytics";
import { formatCurrency, formatNumber, formatPercent, formatRoas, formatDelta } from "@/lib/format";
import { CONVERSION_EVENT_LABELS, CONVERSION_DEFINITION } from "@/lib/data";

type Kind = "currency" | "number" | "percent" | "roas";

const META: Record<KpiKey, { label: string; kind: Kind }> = {
  spend: { label: "광고지출", kind: "currency" },
  impressions: { label: "노출", kind: "number" },
  clicks: { label: "클릭", kind: "number" },
  ctr: { label: "CTR", kind: "percent" },
  cpc: { label: "CPC", kind: "currency" },
  conversions: { label: "전환", kind: "number" },
  conversionValue: { label: "총전환가치", kind: "currency" },
  roas: { label: "ROAS", kind: "roas" },
};

// 핵심 3종 (상단 강조) / 나머지 (하단)
const HERO_KEYS: KpiKey[] = ["spend", "conversionValue", "roas"];
const REST_KEYS: KpiKey[] = ["impressions", "clicks", "ctr", "cpc", "conversions"];

function fmt(kind: Kind, v: number | null): string {
  if (kind === "currency") return formatCurrency(v);
  if (kind === "percent") return formatPercent(v);
  if (kind === "roas") return formatRoas(v);
  return formatNumber(v);
}

function deltaColor(d: Delta): string {
  if (d.dir === "up") return "text-emerald-600 dark:text-emerald-400";
  if (d.dir === "down") return "text-rose-600 dark:text-rose-400";
  if (d.dir === "warn") return "text-amber-600 dark:text-amber-400";
  return "text-slate-400 dark:text-slate-500";
}

function Sparkline({ series }: { series: number[] }) {
  const max = Math.max(...series, 1);
  return (
    <div className="flex h-4 items-end gap-[2px]">
      {series.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-[1px] bg-indigo-500/55"
          style={{ height: `${Math.max(8, Math.round((v / max) * 100))}%` }}
        />
      ))}
    </div>
  );
}

export default function KpiCards() {
  const { data } = useDashboard();
  const [open, setOpen] = useState<KpiKey | null>(null);
  const dl = computeDeltas(data.daily);
  const sp = computeSparks(data.daily);

  const openMeta = open ? META[open] : null;

  const card = (key: KpiKey, hero: boolean) => {
    const m = META[key];
    const value = data.totals[key];
    const delta = dl[key];
    const deltaText = delta.dir === "warn" ? "추적점검" : formatDelta(delta.pct);
    return (
      <button
        key={key}
        onClick={() => setOpen(key)}
        className={`rounded-xl border bg-white text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:bg-slate-900 dark:hover:border-indigo-700 ${
          hero
            ? "border-indigo-200 p-4 dark:border-indigo-900/60"
            : "border-slate-200 p-3 dark:border-slate-800"
        }`}
      >
        <p className={`flex items-center justify-between font-medium text-slate-500 dark:text-slate-400 ${hero ? "text-xs" : "text-[11px]"}`}>
          {m.label}
          <span className="text-slate-300 dark:text-slate-600">⤢</span>
        </p>
        <p className={`mt-0.5 font-bold tabular-nums text-slate-900 dark:text-white ${hero ? "text-2xl sm:text-3xl" : "text-lg"}`}>
          {fmt(m.kind, value as number)}
        </p>
        <div className="my-1.5">
          <Sparkline series={sp[key]} />
        </div>
        <p className={`font-medium ${hero ? "text-xs" : "text-[11px]"} ${deltaColor(delta)}`}>{deltaText}</p>
      </button>
    );
  };

  return (
    <>
      <section aria-label="핵심 지표" className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {HERO_KEYS.map((k) => card(k, true))}
      </section>
      <section aria-label="보조 지표" className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
        {REST_KEYS.map((k) => card(k, false))}
      </section>

      {open && openMeta && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-lg overflow-auto rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {openMeta.label} · 소재별 상세
              </h3>
              <button
                onClick={() => setOpen(null)}
                className="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
            {open === "conversions" || open === "conversionValue" ? (
              <div>
                <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">{CONVERSION_DEFINITION}</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs text-slate-400 dark:border-slate-700">
                      <th className="py-1.5 text-left font-medium">전환 이벤트</th>
                      <th className="py-1.5 text-right font-medium">건수</th>
                      <th className="py-1.5 text-right font-medium">전환가치</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CONVERSION_EVENT_LABELS.map((ev) => {
                      const e = data.conversions.events[ev.key];
                      return (
                        <tr key={ev.key} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-2 text-slate-700 dark:text-slate-200">{ev.label}</td>
                          <td className="py-2 text-right tabular-nums text-slate-900 dark:text-white">{formatNumber(e.count)}</td>
                          <td className="py-2 text-right tabular-nums text-slate-500 dark:text-slate-400">{formatCurrency(e.value)}</td>
                        </tr>
                      );
                    })}
                    <tr className="font-semibold">
                      <td className="py-2 text-slate-700 dark:text-slate-200">합계 (전환)</td>
                      <td className="py-2 text-right tabular-nums text-slate-900 dark:text-white">{formatNumber(data.totals.conversions)}</td>
                      <td className="py-2 text-right tabular-nums text-slate-900 dark:text-white">{formatCurrency(data.totals.conversionValue)}</td>
                    </tr>
                  </tbody>
                </table>
                {data.totals.conversions === 0 && (
                  <p className="mt-3 rounded-lg bg-amber-50 p-3 text-[11px] text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                    세 이벤트 모두 미집계(0)입니다 — 전환 추적(픽셀/전환 API)이 연결되면 자동으로 채워집니다.
                  </p>
                )}
              </div>
            ) : open === "roas" ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/50">
                  <span className="text-slate-500 dark:text-slate-400">전환가치</span>
                  <span className="font-semibold tabular-nums text-slate-900 dark:text-white">{formatCurrency(data.totals.conversionValue)}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/50">
                  <span className="text-slate-500 dark:text-slate-400">÷ 지출</span>
                  <span className="font-semibold tabular-nums text-slate-900 dark:text-white">{formatCurrency(data.totals.spend)}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-indigo-50 px-3 py-2 dark:bg-indigo-950/40">
                  <span className="font-medium text-indigo-600 dark:text-indigo-300">= ROAS</span>
                  <span className="font-bold tabular-nums text-indigo-700 dark:text-indigo-200">{formatRoas(data.totals.roas)}</span>
                </div>
                {data.totals.roas === null && (
                  <p className="rounded-lg bg-amber-50 p-3 text-[11px] text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                    전환가치가 0(추적 미연결)이라 ROAS는 미집계입니다 — 전환 추적 연결 시 자동 계산됩니다.
                  </p>
                )}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs text-slate-400 dark:border-slate-700">
                    <th className="py-1.5 text-left font-medium">소재</th>
                    <th className="py-1.5 text-right font-medium">{openMeta.label}</th>
                    <th className="py-1.5 text-right font-medium">지출</th>
                  </tr>
                </thead>
                <tbody>
                  {[...data.creatives]
                    .sort((a, b) => (creativeMetric(b, open) ?? -Infinity) - (creativeMetric(a, open) ?? -Infinity))
                    .map((c) => (
                      <tr key={c.id} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-2 pr-2">
                          <span className="mr-1.5 rounded bg-slate-100 px-1 py-0.5 text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            {c.type}
                          </span>
                          <span className="text-slate-700 dark:text-slate-200">{c.name}</span>
                        </td>
                        <td className="py-2 text-right font-semibold tabular-nums text-slate-900 dark:text-white">
                          {fmt(openMeta.kind, creativeMetric(c, open))}
                        </td>
                        <td className="py-2 text-right tabular-nums text-slate-500 dark:text-slate-400">
                          {formatCurrency(c.spend)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
            <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
              기간 {data.period.label} · 소재(ad) 레벨 집계
            </p>
          </div>
        </div>
      )}
    </>
  );
}
