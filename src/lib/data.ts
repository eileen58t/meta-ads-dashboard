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
  { key: "snapshot", label: "6/19 ~ 6/24 (스냅샷)" },
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
  { date: "2026-06-24", spend: 16657, impressions: 941, clicks: 56, ctr: 5.95, cpc: 297 },
];

const ADSETS: AdSet[] = [
  { name: "슈가놉 달콤세트", status: "ACTIVE", objective: "트래픽", spend: 37825, impressions: 7117, clicks: 214, ctr: 3.01, cpc: 177, result: "랜딩조회 196" },
  { name: "우리밀 초코 시나몬크래커", status: "ACTIVE", objective: "트래픽", spend: 6287, impressions: 1178, clicks: 63, ctr: 5.35, cpc: 100, result: "랜딩조회 40" },
  { name: "슈가놉 달콤세트(판매)", status: "ACTIVE", objective: "판매", spend: 6098, impressions: 224, clicks: 9, ctr: 4.02, cpc: 678, result: "구매 0" },
  { name: "우리밀 크래커(판매)", status: "ACTIVE", objective: "판매", spend: 5564, impressions: 287, clicks: 4, ctr: 1.39, cpc: 1391, result: "구매 0" },
];

const CREATIVES: Creative[] = [
  { id: "120249342032010294", name: "이미지광고 (달콤세트)", type: "이미지", objective: "트래픽", status: "ACTIVE", spend: 37825, impressions: 7117, clicks: 214, ctr: 3.01, cpc: 177, result: "랜딩조회 196" },
  { id: "120249342832700294", name: "영상이미지 (시나몬크래커)", type: "영상", objective: "트래픽", status: "ACTIVE", spend: 6287, impressions: 1178, clicks: 63, ctr: 5.35, cpc: 100, result: "랜딩조회 40" },
  { id: "120249426032550294", name: "이미지광고 (달콤세트·판매)", type: "이미지", objective: "판매", status: "ACTIVE", spend: 6098, impressions: 224, clicks: 9, ctr: 4.02, cpc: 678, result: "구매 0" },
  { id: "120249426032530294", name: "영상이미지 (크래커·판매)", type: "영상", objective: "판매", status: "ACTIVE", spend: 5564, impressions: 287, clicks: 4, ctr: 1.39, cpc: 1391, result: "구매 0" },
];

const SEGMENTS: Record<SegmentKey, Segment[]> = {
  age: [
    { label: "18-24", spend: 9766, impressions: 2888, clicks: 70, ctr: 2.42, cpc: 140 },
    { label: "25-34", spend: 20193, impressions: 3614, clicks: 112, ctr: 3.1, cpc: 180 },
    { label: "35-44", spend: 14701, impressions: 1508, clicks: 69, ctr: 4.58, cpc: 213 },
    { label: "45-54", spend: 6207, impressions: 465, clicks: 18, ctr: 3.87, cpc: 345 },
    { label: "55-64", spend: 3403, impressions: 204, clicks: 11, ctr: 5.39, cpc: 309 },
    { label: "65+", spend: 1673, impressions: 135, clicks: 11, ctr: 8.15, cpc: 152 },
  ],
  gender: [
    { label: "여성", spend: 42038, impressions: 5679, clicks: 202, ctr: 3.56, cpc: 208 },
    { label: "남성", spend: 13704, impressions: 3087, clicks: 88, ctr: 2.85, cpc: 156 },
    { label: "미상", spend: 201, impressions: 48, clicks: 1, ctr: 2.08, cpc: 201 },
  ],
  region: [
    { label: "경기", spend: 13727, impressions: 2059, clicks: 64, ctr: 3.11, cpc: 214 },
    { label: "서울", spend: 13356, impressions: 2288, clicks: 79, ctr: 3.45, cpc: 169 },
    { label: "부산", spend: 3842, impressions: 550, clicks: 15, ctr: 2.73, cpc: 256 },
    { label: "경북", spend: 3273, impressions: 381, clicks: 18, ctr: 4.72, cpc: 182 },
    { label: "인천", spend: 2938, impressions: 436, clicks: 12, ctr: 2.75, cpc: 245 },
    { label: "경남", spend: 2888, impressions: 448, clicks: 13, ctr: 2.9, cpc: 222 },
    { label: "대구", spend: 2405, impressions: 422, clicks: 8, ctr: 1.9, cpc: 301 },
    { label: "충남", spend: 2388, impressions: 399, clicks: 12, ctr: 3.01, cpc: 199 },
  ],
  platform: [
    { label: "Instagram", spend: 54008, impressions: 8204, clicks: 275, ctr: 3.35, cpc: 196 },
    { label: "Facebook", spend: 1587, impressions: 483, clicks: 16, ctr: 3.31, cpc: 99 },
    { label: "Threads", spend: 336, impressions: 124, clicks: 0, ctr: 0, cpc: null },
    { label: "Audience Net.", spend: 12, impressions: 3, clicks: 0, ctr: 0, cpc: null },
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
  landingViews: 236,
  events: CONV_EVENTS,
};

// 기본 스냅샷 (라이브 실패/토큰 미설정 시 폴백)
export const SNAPSHOT: DashboardData = {
  account: { id: "1325641186375906", name: "13_슈가놉_이은영", business: "Artience", currency: CURRENCY },
  period: { since: "2026-06-19", until: "2026-06-24", label: "6/19 ~ 6/24 (스냅샷)", note: "6/24는 진행 중인 부분 데이터" },
  totals: totalsFromDaily(DAILY, { count: CONVERSIONS.count, value: CONVERSIONS.value }),
  daily: DAILY,
  adsets: ADSETS,
  creatives: CREATIVES,
  segments: SEGMENTS,
  conversions: CONVERSIONS,
};
