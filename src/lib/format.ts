import { CURRENCY_SYMBOL } from "./data";

const NO_DATA = "미집계";

/** 통화(KRW=₩) 표기. null/undefined → "미집계" */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return NO_DATA;
  return `${CURRENCY_SYMBOL}${Math.round(value).toLocaleString("ko-KR")}`;
}

/** 정수/실수 콤마 표기. null → "미집계" */
export function formatNumber(value: number | null | undefined, digits = 0): string {
  if (value === null || value === undefined || Number.isNaN(value)) return NO_DATA;
  return value.toLocaleString("ko-KR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/** 퍼센트 표기. null → "미집계" */
export function formatPercent(value: number | null | undefined, digits = 2): string {
  if (value === null || value === undefined || Number.isNaN(value)) return NO_DATA;
  return `${value.toFixed(digits)}%`;
}

/** ROAS 표기(배수). null → "미집계" */
export function formatRoas(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return NO_DATA;
  return `${value.toFixed(2)}x`;
}

/** "2026-06-23" → "6/23" */
export function formatShortDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${Number(m)}/${Number(d)}`;
}

/** 증감률 → "+31%" / "-61%" / "—" */
export function formatDelta(pct: number | null | undefined): string {
  if (pct === null || pct === undefined || Number.isNaN(pct)) return "—";
  const sign = pct > 0 ? "+" : "";
  return `${sign}${Math.round(pct)}%`;
}
