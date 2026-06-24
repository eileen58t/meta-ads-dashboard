"use client";

import { useState } from "react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useDashboard } from "./DashboardProvider";
import { SegmentKey, SEGMENT_LABELS } from "@/lib/data";

const TABS: SegmentKey[] = ["age", "gender", "region", "platform"];

export default function BreakdownTabs() {
  const { data } = useDashboard();
  const [tab, setTab] = useState<SegmentKey>("age");
  const chartData = data.segments[tab].map((s) => ({
    label: s.label,
    spend: s.spend,
    ctr: s.ctr ?? 0,
  }));

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">분류별 성과</h2>
        <div className="flex flex-wrap gap-1.5">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-md border px-3 py-1 text-xs font-medium transition ${
                tab === t
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}>
              {SEGMENT_LABELS[t]}
            </button>
          ))}
        </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="currentColor" className="text-slate-500 dark:text-slate-400" />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="currentColor" className="text-slate-400" tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="currentColor" className="text-slate-400" tickFormatter={(v: number) => `${v}%`} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar yAxisId="left" dataKey="spend" name="지출(₩)" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={48} />
            <Line yAxisId="right" type="monotone" dataKey="ctr" name="CTR(%)" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
