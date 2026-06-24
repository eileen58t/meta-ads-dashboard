"use client";

import { useState } from "react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useDashboard } from "./DashboardProvider";
import { formatShortDate } from "@/lib/format";

type LeftKey = "spend" | "impressions" | "clicks";
type RightKey = "ctr" | "cpc";

const LEFT_META: Record<LeftKey, { name: string; fmt: (v: number) => string }> = {
  spend: { name: "지출(₩)", fmt: (v) => `${Math.round(v / 1000)}k` },
  impressions: { name: "노출", fmt: (v) => `${v}` },
  clicks: { name: "클릭", fmt: (v) => `${v}` },
};
const RIGHT_META: Record<RightKey, { name: string; fmt: (v: number) => string }> = {
  ctr: { name: "CTR(%)", fmt: (v) => `${v}%` },
  cpc: { name: "CPC(₩)", fmt: (v) => `₩${v}` },
};

export default function ComparisonChart() {
  const { data } = useDashboard();
  const [left, setLeft] = useState<LeftKey>("spend");
  const [right, setRight] = useState<RightKey>("ctr");

  const chartData = data.daily.map((d) => ({
    date: formatShortDate(d.date),
    left: d[left],
    right: d[right],
  }));

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">일자별 이중축 비교</h2>
        <div className="flex items-center gap-2 text-sm">
          <select value={left} onChange={(e) => setLeft(e.target.value as LeftKey)}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <option value="spend">지출</option>
            <option value="impressions">노출</option>
            <option value="clicks">클릭</option>
          </select>
          <span className="text-xs text-slate-400">vs</span>
          <select value={right} onChange={(e) => setRight(e.target.value as RightKey)}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <option value="ctr">CTR</option>
            <option value="cpc">CPC</option>
          </select>
        </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="currentColor" className="text-slate-500 dark:text-slate-400" />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="currentColor" className="text-slate-400" tickFormatter={LEFT_META[left].fmt} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="currentColor" className="text-slate-400" tickFormatter={RIGHT_META[right].fmt} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar yAxisId="left" dataKey="left" name={LEFT_META[left].name} fill="#6366f1" radius={[3, 3, 0, 0]} maxBarSize={48} />
            <Line yAxisId="right" type="monotone" dataKey="right" name={RIGHT_META[right].name} stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} connectNulls />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
