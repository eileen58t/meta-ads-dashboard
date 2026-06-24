"use client";

import { useDashboard } from "./DashboardProvider";
import { PRESETS, PresetKey } from "@/lib/data";

const SOURCE_BADGE: Record<string, { text: string; cls: string }> = {
  live: { text: "실시간", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300" },
  snapshot: { text: "스냅샷", cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" },
  "snapshot-no-token": { text: "스냅샷 · 토큰없음", cls: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300" },
  "snapshot-error": { text: "스냅샷 · 연동오류", cls: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300" },
};

function timeAgo(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function Controls() {
  const {
    preset, setPreset, source, fetchedAt, loading,
    autoRefresh, setAutoRefresh, intervalSec, setIntervalSec, refresh,
  } = useDashboard();
  const badge = SOURCE_BADGE[source] ?? SOURCE_BADGE.snapshot;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <select
        value={preset}
        onChange={(e) => setPreset(e.target.value as PresetKey)}
        className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        aria-label="기간 선택"
      >
        {PRESETS.map((p) => (
          <option key={p.key} value={p.key}>{p.label}</option>
        ))}
      </select>

      <button
        onClick={refresh}
        disabled={loading}
        className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        {loading ? "갱신 중…" : "↻ 새로고침"}
      </button>

      <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
        <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
        자동 새로고침
      </label>

      <select
        value={intervalSec}
        onChange={(e) => setIntervalSec(Number(e.target.value))}
        disabled={!autoRefresh}
        className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        aria-label="새로고침 간격"
      >
        <option value={30}>30초</option>
        <option value={60}>1분</option>
        <option value={300}>5분</option>
      </select>

      <span className={`rounded-md px-2 py-1 text-[11px] font-medium ${badge.cls}`}>{badge.text}</span>
      <span className="ml-auto text-[11px] text-slate-400 dark:text-slate-500">
        마지막 갱신 {timeAgo(fetchedAt)}
      </span>
    </div>
  );
}
