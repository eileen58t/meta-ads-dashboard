"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { DashboardData, PresetKey } from "@/lib/data";

export type Source = "snapshot" | "snapshot-no-token" | "snapshot-error" | "live";

type Ctx = {
  data: DashboardData;
  source: Source;
  fetchedAt: string | null;
  preset: PresetKey;
  loading: boolean;
  autoRefresh: boolean;
  intervalSec: number;
  setPreset: (p: PresetKey) => void;
  setAutoRefresh: (v: boolean) => void;
  setIntervalSec: (n: number) => void;
  refresh: () => void;
};

const DashboardCtx = createContext<Ctx | null>(null);

export function useDashboard() {
  const c = useContext(DashboardCtx);
  if (!c) throw new Error("useDashboard must be used within DashboardProvider");
  return c;
}

export default function DashboardProvider({
  initial,
  children,
}: {
  initial: DashboardData;
  children: React.ReactNode;
}) {
  const [data, setData] = useState<DashboardData>(initial);
  const [source, setSource] = useState<Source>("snapshot");
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [preset, setPresetState] = useState<PresetKey>("snapshot");
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [intervalSec, setIntervalSec] = useState(60);
  const reqId = useRef(0);

  const load = useCallback(async (p: PresetKey) => {
    const id = ++reqId.current;
    setLoading(true);
    try {
      const res = await fetch(`/api/insights?preset=${p}`, { cache: "no-store" });
      const json = await res.json();
      if (id !== reqId.current) return; // 더 최신 요청이 있으면 무시
      if (json?.data) {
        setData(json.data);
        setSource(json.source);
        setFetchedAt(json.fetchedAt);
      }
    } catch {
      // 네트워크 실패 시 기존 데이터 유지
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  }, []);

  const setPreset = useCallback(
    (p: PresetKey) => {
      setPresetState(p);
      load(p);
    },
    [load],
  );

  const refresh = useCallback(() => load(preset), [load, preset]);

  useEffect(() => {
    if (!autoRefresh) return;
    const t = setInterval(() => load(preset), Math.max(10, intervalSec) * 1000);
    return () => clearInterval(t);
  }, [autoRefresh, intervalSec, preset, load]);

  return (
    <DashboardCtx.Provider
      value={{
        data,
        source,
        fetchedAt,
        preset,
        loading,
        autoRefresh,
        intervalSec,
        setPreset,
        setAutoRefresh,
        setIntervalSec,
        refresh,
      }}
    >
      {children}
    </DashboardCtx.Provider>
  );
}
