// =============================================================================
// Meta Ads 데이터 (통합 대시보드)
// -----------------------------------------------------------------------------
// 출처: Meta Ads MCP `ads_get_ad_entities`
//   - 계정: 1325641186375906 ("13_슈가놉_이은영", Artience), 통화 KRW
//   - 기본 스냅샷 기간: 2026-06-19 ~ 2026-06-24
// 라이브 연동 시 /api/insights 가 Meta Graph API 결과를 같은 형태로 채운다.
// 못 가져온 값은 추측하지 않고 null(미집계).
// =============================================================================

export const CURRENCY = "KRW" as const;
export const CURRENCY_SYMBOL = "₩";

export type Totals = {
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number | null;
  cpc: number | null;
  conversions: number;
  conversionValue: number;
  roas: number | null; // 전환가치 / 지출. 전환가치 0이면 null(미집계)
};

export type DailyStat = {
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number | null;
  cpc: number | null;
};

export type Segment = {
  label: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number | null;
  cpc: number | null;
};

export type AdSet = {
  name: string;
  status: "ACTIVE" | "PAUSED";
  objective: "트래픽" | "판매";
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number | null;
  cpc: number | null;
  result: string;
};

export type Creative = {
  id: string;
  name: string;
  type: "이미지" | "영상";
  objective: "트래픽" | "판매";
  status: "ACTIVE" | "PAUSED";
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number | null;
  cpc: number | null;
  result: string;
};

export type SegmentKey = "age" | "gender" | "region" | "platform";

// 전환 정의: 장바구니 담기 + 결제 시작 + 구매 의 합
export const CONVERSION_DEFINITION = "전환 = 장바구니 담기 + 결제 시작 + 구매";

export type ConversionEvent = { count: number; value: number };
export type ConversionEvents = {
  addToCart: ConversionEvent;
  initiateCheckout: ConversionEvent;
  purchase: ConversionEvent;
};
export type Conversions = {
  count: number; // 세 이벤트 count 합
  value: number; // 세 이벤트 value 합 (KRW)
  landingViews: number;
  events: ConversionEvents;
};

export function sumConversions(e: ConversionEvents): { count: number; value: number } {
  return {
    count: e.addToCart.count + e.initiateCheckout.count + e.purchase.count,
    value: e.addToCart.value + e.initiateCheckout.value + e.purchase.value,
  };
}

export const CONVERSION_EVENT_LABELS: { key: keyof ConversionEvents; label: string }[] = [
  { key: "addToCart", label: "장바구니 담기" },
  { key: "initiateCheckout", label: "결제 시작" },
  { key: "purchase", label: "구매" },
];

export type DashboardData = {
  account: { id: string; name: string; business: string; currency: string };
  period: { since: string; until: string; label: string; note?: string };
  totals: Totals;
  daily: DailyStat[];
  adsets: AdSet[];
  creatives: Creative[];
  segments: Record<SegmentKey, Segment[]>;
  conversions: Conversions;
};

export const SEGMENT_LABELS: Record<SegmentKey, string> = {
  age: "연령",
  gender: "성별",
  region: "지역",
  platform: "플랫폼",
};

// 기간 프리셋 (드롭다운). key는 Meta date_preset 과 매핑(snapshot 제외).
export type PresetKey =
  | "snapshot"
  | "today"
  | "yesterday"
  | "last_3d"
  | "last_7d"
  | "last_14d"
  | "last_30d"
  | "this_month"
  | "maximum";

export const PRESETS: { key: PresetKey; label: string }[] = [
  { key: "snapshot", label: "6/19 ~ 6/25 (스냅샷)" },
  { key: "today", label: "오늘" },
  { key: "yesterday", label: "어제" },
  { key: "last_3d", label: "최근 3일" },
  { key: "last_7d", label: "최근 7일" },
  { key: "last_14d", label: "최근 14일" },
  { key: "last_30d", label: "최근 30일" },
  { key: "this_month", label: "이번 달" },
  { key: "maximum", label: "전체 기간" },
];

const DAILY: DailyStat[] = [
  { date: "2026-06-19", spend: 58, impressions: 4, clicks: 1, ctr: 25.0, cpc: 58 },
  { date: "2026-06-20", spend: 109, impressions: 3, clicks: 0, ctr: 0, cpc: null },
  { date: "2026-06-21", spend: 2, impressions: 1, clicks: 0, ctr: 0, cpc: null },
  { date: "2026-06-22", spend: 26432, impressions: 5458, clicks: 149, ctr: 2.73, cpc: 177 },
  { date: "2026-06-23", spend: 12685, impressions: 2407, clicks: 85, ctr: 3.53, cpc: 149 },
  { date: "2026-06-24", spend: 35742, impressions: 2234, clicks: 112, ctr: 5.01, cpc: 319 },
  { date: "2026-06-25", spend: 1206, impressions: 77, clicks: 2, ctr: 2.6, cpc: 603 },
];

const ADSETS: AdSet[] = [
  { name: "슈가놉 달콤세트", status: "PAUSED", objective: "트래픽", spend: 40374, impressions: 7325, clicks: 226, ctr: 3.09, cpc: 179, result: "랜딩조회 211" },
  { name: "우리밀 초코 시나몬크래커", status: "PAUSED", objective: "트래픽", spend: 11522, impressions: 1612, clicks: 91, ctr: 5.65, cpc: 127, result: "랜딩조회 67" },
  { name: "슈가놉 달콤세트(판매)", status: "PAUSED", objective: "판매", spend: 11192, impressions: 516, clicks: 19, ctr: 3.68, cpc: 589, result: "구매 0" },
  { name: "우리밀 크래커(판매)", status: "PAUSED", objective: "판매", spend: 12977, impressions: 723, clicks: 12, ctr: 1.66, cpc: 1081, result: "구매 0" },
];

const CREATIVES: Creative[] = [
  { id: "120249342032010294", name: "이미지광고 (달콤세트)", type: "이미지", objective: "트래픽", status: "PAUSED", spend: 40374, impressions: 7325, clicks: 226, ctr: 3.09, cpc: 179, result: "랜딩조회 211" },
  { id: "120249342832700294", name: "영상이미지 (시나몬크래커)", type: "영상", objective: "트래픽", status: "PAUSED", spend: 11522, impressions: 1612, clicks: 91, ctr: 5.65, cpc: 127, result: "랜딩조회 67" },
  { id: "120249426032550294", name: "이미지광고 (달콤세트·판매)", type: "이미지", objective: "판매", status: "PAUSED", spend: 11192, impressions: 516, clicks: 19, ctr: 3.68, cpc: 589, result: "구매 0" },
  { id: "120249426032530294", name: "영상이미지 (크래커·판매)", type: "영상", objective: "판매", status: "PAUSED", spend: 12977, impressions: 723, clicks: 12, ctr: 1.66, cpc: 1081, result: "구매 0" },
];

const SEGMENTS: Record<SegmentKey, Segment[]> = {
  age: [
    { label: "18-24", spend: 10770, impressions: 3048, clicks: 71, ctr: 2.33, cpc: 152 },
    { label: "25-34", spend: 23447, impressions: 3938, clicks: 124, ctr: 3.15, cpc: 189 },
    { label: "35-44", spend: 20419, impressions: 1878, clicks: 88, ctr: 4.69, cpc: 232 },
    { label: "45-54", spend: 12766, impressions: 778, clicks: 32, ctr: 4.11, cpc: 399 },
    { label: "55-64", spend: 6223, impressions: 345, clicks: 19, ctr: 5.51, cpc: 328 },
    { label: "65+", spend: 2609, impressions: 197, clicks: 15, ctr: 7.61, cpc: 174 },
  ],
  gender: [
    { label: "여성", spend: 58297, impressions: 6650, clicks: 255, ctr: 3.83, cpc: 229 },
    { label: "남성", spend: 17595, impressions: 3480, clicks: 93, ctr: 2.67, cpc: 189 },
    { label: "미상", spend: 342, impressions: 54, clicks: 1, ctr: 1.85, cpc: 342 },
  ],
  region: [
    { label: "서울", spend: 16390, impressions: 2561, clicks: 90, ctr: 3.51, cpc: 182 },
    { label: "경기", spend: 18948, impressions: 2411, clicks: 80, ctr: 3.32, cpc: 237 },
    { label: "부산", spend: 5528, impressions: 635, clicks: 20, ctr: 3.15, cpc: 276 },
    { label: "경남", spend: 4105, impressions: 546, clicks: 18, ctr: 3.3, cpc: 228 },
    { label: "인천", spend: 4120, impressions: 507, clicks: 15, ctr: 2.96, cpc: 275 },
    { label: "대구", spend: 3390, impressions: 475, clicks: 10, ctr: 2.11, cpc: 339 },
    { label: "충남", spend: 3856, impressions: 474, clicks: 18, ctr: 3.8, cpc: 214 },
    { label: "경북", spend: 4123, impressions: 441, clicks: 18, ctr: 4.08, cpc: 229 },
  ],
  platform: [
    { label: "Instagram", spend: 72448, impressions: 9352, clicks: 327, ctr: 3.5, cpc: 222 },
    { label: "Facebook", spend: 2254, impressions: 518, clicks: 18, ctr: 3.47, cpc: 125 },
    { label: "Threads", spend: 1439, impressions: 307, clicks: 4, ctr: 1.3, cpc: 360 },
    { label: "Audience Net.", spend: 93, impressions: 7, clicks: 0, ctr: 0, cpc: null },
  ],
};

function totalsFromDaily(daily: DailyStat[], conv: { count: number; value: number }): Totals {
  const spend = daily.reduce((s, d) => s + d.spend, 0);
  const impressions = daily.reduce((s, d) => s + d.impressions, 0);
  const clicks = daily.reduce((s, d) => s + d.clicks, 0);
  return {
    spend,
    impressions,
    clicks,
    ctr: impressions > 0 ? (clicks / impressions) * 100 : null,
    cpc: clicks > 0 ? spend / clicks : null,
    conversions: conv.count,
    conversionValue: conv.value,
    roas: spend > 0 && conv.value > 0 ? conv.value / spend : null,
  };
}

// 전환 추적 미연결 → 세 이벤트 모두 미집계(0). 추적 연결 시 라이브에서 채워짐.
const CONV_EVENTS: ConversionEvents = {
  addToCart: { count: 0, value: 0 },
  initiateCheckout: { count: 0, value: 0 },
  purchase: { count: 0, value: 0 },
};
const convSum = sumConversions(CONV_EVENTS);
const CONVERSIONS: Conversions = {
  count: convSum.count,
  value: convSum.value,
  landingViews: 278, // 트래픽 캠페인 랜딩페이지 조회 (211 + 67)
  events: CONV_EVENTS,
};

// 기본 스냅샷 (라이브 실패/토큰 미설정 시 폴백)
export const SNAPSHOT: DashboardData = {
  account: { id: "1325641186375906", name: "13_슈가놉_이은영", business: "Artience", currency: CURRENCY },
  period: { since: "2026-06-19", until: "2026-06-25", label: "6/19 ~ 6/25 (스냅샷)", note: "6/25 기준 · 현재 전 캠페인 일시중지" },
  totals: totalsFromDaily(DAILY, { count: CONVERSIONS.count, value: CONVERSIONS.value }),
  daily: DAILY,
  adsets: ADSETS,
  creatives: CREATIVES,
  segments: SEGMENTS,
  conversions: CONVERSIONS,
};
