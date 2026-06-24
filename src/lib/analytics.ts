import { DashboardData, DailyStat, AdSet, Creative } from "./data";

export type KpiKey =
  | "spend"
  | "impressions"
  | "clicks"
  | "ctr"
  | "cpc"
  | "conversions"
  | "conversionValue"
  | "roas";

export type Delta = { pct: number | null; dir: "up" | "down" | "flat" | "warn" };

function deltaOf(series: number[]): Delta {
  if (series.length < 2) return { pct: null, dir: "flat" };
  const cur = series[series.length - 1];
  const prev = series[series.length - 2];
  if (prev === 0) return { pct: null, dir: "flat" };
  const pct = ((cur - prev) / prev) * 100;
  return { pct, dir: pct > 0.5 ? "up" : pct < -0.5 ? "down" : "flat" };
}

function seriesOf(daily: DailyStat[], key: "spend" | "impressions" | "clicks" | "ctr" | "cpc"): number[] {
  return daily.map((d) => {
    const v = d[key];
    return v === null || v === undefined ? 0 : v;
  });
}

export function sparks(daily: DailyStat[]): Record<KpiKey, number[]> {
  return {
    spend: seriesOf(daily, "spend"),
    impressions: seriesOf(daily, "impressions"),
    clicks: seriesOf(daily, "clicks"),
    ctr: seriesOf(daily, "ctr"),
    cpc: seriesOf(daily, "cpc"),
    conversions: daily.map(() => 0),
    conversionValue: daily.map(() => 0),
    roas: daily.map(() => 0),
  };
}

export function deltas(daily: DailyStat[]): Record<KpiKey, Delta> {
  return {
    spend: deltaOf(seriesOf(daily, "spend")),
    impressions: deltaOf(seriesOf(daily, "impressions")),
    clicks: deltaOf(seriesOf(daily, "clicks")),
    ctr: deltaOf(seriesOf(daily, "ctr")),
    cpc: deltaOf(seriesOf(daily, "cpc")),
    conversions: { pct: null, dir: "warn" },
    conversionValue: { pct: null, dir: "warn" },
    roas: { pct: null, dir: "warn" },
  };
}

export function rankAdsets(adsets: AdSet[]): AdSet[] {
  return [...adsets].sort((a, b) => (b.ctr ?? -1) - (a.ctr ?? -1));
}

export function rankCreatives(creatives: Creative[]): Creative[] {
  return [...creatives].sort((a, b) => (b.ctr ?? -1) - (a.ctr ?? -1));
}

// KPI별 소재 값 추출 (모달용)
export function creativeMetric(c: Creative, key: KpiKey): number | null {
  switch (key) {
    case "spend": return c.spend;
    case "impressions": return c.impressions;
    case "clicks": return c.clicks;
    case "ctr": return c.ctr;
    case "cpc": return c.cpc;
    default: return null; // 전환/전환가치는 소재별 미집계
  }
}

export type Insight = { label: string; value: string };

export function insights(data: DashboardData): { best: Insight[]; worst: Insight[] } {
  const age = [...data.segments.age].sort((a, b) => (b.ctr ?? 0) - (a.ctr ?? 0));
  const gender = [...data.segments.gender].sort((a, b) => (b.ctr ?? 0) - (a.ctr ?? 0));
  const plat = [...data.segments.platform].filter((p) => p.cpc !== null).sort((a, b) => (a.cpc ?? Infinity) - (b.cpc ?? Infinity));
  const cre = rankCreatives(data.creatives);
  const region = [...data.segments.region].filter((r) => r.cpc !== null).sort((a, b) => (b.cpc ?? 0) - (a.cpc ?? 0));
  const bestAge = age[0];
  const bestGender = gender[0];
  const bestPlat = plat[0];
  const bestCre = cre[0];
  const worstCre = cre[cre.length - 1];
  const worstRegion = region[0];
  return {
    best: [
      bestAge && { label: `${bestAge.label} CTR`, value: `${bestAge.ctr}%` },
      bestCre && { label: `${bestCre.type} 소재 CTR`, value: `${bestCre.ctr}%` },
      bestPlat && { label: `${bestPlat.label} CPC`, value: `₩${bestPlat.cpc}` },
      bestGender && { label: `${bestGender.label} CTR`, value: `${bestGender.ctr}%` },
    ].filter(Boolean) as Insight[],
    worst: [
      worstCre && { label: `${worstCre.name.slice(0, 10)} CTR`, value: `${worstCre.ctr}%` },
      worstRegion && { label: `${worstRegion.label} CPC`, value: `₩${worstRegion.cpc}` },
      { label: "판매 캠페인 전환", value: `${data.conversions.count}` },
    ].filter(Boolean) as Insight[],
  };
}

export type Action = { icon: string; title: string; reason: string };

export function actions(data: DashboardData): Action[] {
  const out: Action[] = [];
  const cre = rankCreatives(data.creatives);
  const bestCre = cre[0];
  const imgCre = data.creatives.find((c) => c.type === "이미지");
  if (bestCre && imgCre && bestCre.ctr && imgCre.ctr) {
    const lift = Math.round(((bestCre.ctr - imgCre.ctr) / imgCre.ctr) * 100);
    out.push({
      icon: "video",
      title: `${bestCre.type} 소재 비중 확대`,
      reason: `${bestCre.type} CTR ${bestCre.ctr}% vs 이미지 ${imgCre.ctr}% — 약 ${lift}% 높음. 예산 더 실어볼 가치.`,
    });
  }
  out.push({
    icon: "target",
    title: "35-44세·여성·수도권 코어 타깃 집중",
    reason: "35-44 CTR 4.58%, 여성 CTR 3.56%, 서울·경기 노출 절반. 볼륨+반응 모두 양호.",
  });
  const fb = data.segments.platform.find((p) => p.label === "Facebook");
  if (fb && fb.cpc) {
    out.push({
      icon: "flask",
      title: "Facebook 소액 테스트로 채널 다변화",
      reason: `예산 대부분이 Instagram. Facebook CPC ₩${fb.cpc}로 더 저렴 — 노출만 적었을 뿐 효율 가능성.`,
    });
  }
  if (data.conversions.count === 0) {
    out.push({
      icon: "bug",
      title: "판매 캠페인 픽셀·전환 추적 점검",
      reason: `클릭 ${data.totals.clicks}·랜딩조회 ${data.conversions.landingViews}건 발생했지만 구매 0건 → 전환 추적/랜딩 흐름 점검 필요.`,
    });
  }
  return out;
}

export function diagnosis(data: DashboardData): string {
  const t = data.totals;
  return (
    `${data.period.label} 지출 ₩${t.spend.toLocaleString("ko-KR")} · CTR ${t.ctr?.toFixed(2) ?? "—"}%로 ` +
    `트래픽은 도나, 판매 캠페인 구매 ${t.conversions}건으로 매출 기여는 ` +
    (t.conversions === 0 ? "확인 불가. 전환 추적 점검이 우선입니다." : "점검이 필요합니다.")
  );
}
