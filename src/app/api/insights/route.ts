import { NextRequest, NextResponse } from "next/server";
import {
  SNAPSHOT,
  PRESETS,
  PresetKey,
  DashboardData,
  DailyStat,
  Segment,
  AdSet,
  Creative,
  ConversionEvents,
  sumConversions,
} from "@/lib/data";

export const dynamic = "force-dynamic";

const GRAPH = "https://graph.facebook.com/v21.0";
const ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID || SNAPSHOT.account.id;
const TOKEN = process.env.META_ACCESS_TOKEN || "";

const num = (v: unknown): number => {
  const n = typeof v === "string" ? parseFloat(v.replace(/[, ]/g, "")) : Number(v);
  return Number.isFinite(n) ? n : 0;
};

type ActionItem = { action_type: string; value: string };
type Row = Record<string, unknown> & {
  actions?: ActionItem[];
  action_values?: ActionItem[];
};

async function fetchInsights(params: Record<string, string>): Promise<Row[]> {
  const qs = new URLSearchParams({ access_token: TOKEN, ...params });
  const res = await fetch(`${GRAPH}/act_${ACCOUNT_ID}/insights?${qs}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Meta ${res.status}`);
  const json = (await res.json()) as { data?: Row[] };
  return json.data ?? [];
}

const FIELDS = "spend,impressions,clicks,ctr,cpc,actions,action_values";

// 전환 이벤트 매핑 — 여러 호환 action_type 중 첫 매칭값 사용
const EVENT_TYPES = {
  addToCart: ["omni_add_to_cart", "offsite_conversion.fb_pixel_add_to_cart", "add_to_cart"],
  initiateCheckout: ["omni_initiated_checkout", "offsite_conversion.fb_pixel_initiate_checkout", "initiate_checkout"],
  purchase: ["omni_purchase", "offsite_conversion.fb_pixel_purchase", "purchase"],
};

function pickAction(items: ActionItem[] | undefined, types: string[]): number {
  if (!items) return 0;
  for (const t of types) {
    const a = items.find((x) => x.action_type === t);
    if (a) return num(a.value);
  }
  return 0;
}

function actionVal(row: Row, type: string): number {
  const a = row.actions?.find((x) => x.action_type === type);
  return a ? num(a.value) : 0;
}

// 전환 = 장바구니 담기 + 결제 시작 + 구매 (count, value 각각)
function conversionEvents(row: Row): ConversionEvents {
  return {
    addToCart: { count: pickAction(row.actions, EVENT_TYPES.addToCart), value: pickAction(row.action_values, EVENT_TYPES.addToCart) },
    initiateCheckout: { count: pickAction(row.actions, EVENT_TYPES.initiateCheckout), value: pickAction(row.action_values, EVENT_TYPES.initiateCheckout) },
    purchase: { count: pickAction(row.actions, EVENT_TYPES.purchase), value: pickAction(row.action_values, EVENT_TYPES.purchase) },
  };
}

function toSegment(row: Row, labelKey: string): Segment {
  const clicks = num(row.clicks);
  const impressions = num(row.impressions);
  return {
    label: String(row[labelKey] ?? "기타"),
    spend: Math.round(num(row.spend)),
    impressions,
    clicks,
    ctr: impressions > 0 ? (clicks / impressions) * 100 : null,
    cpc: clicks > 0 ? num(row.spend) / clicks : null,
  };
}

async function buildLive(preset: PresetKey, label: string): Promise<DashboardData> {
  const dp = { date_preset: preset === "snapshot" ? "last_7d" : preset };

  // 일자별
  const dailyRows = await fetchInsights({ ...dp, fields: FIELDS, time_increment: "1" });
  const daily: DailyStat[] = dailyRows.map((r) => {
    const clicks = num(r.clicks);
    const impressions = num(r.impressions);
    return {
      date: String(r.date_start ?? ""),
      spend: Math.round(num(r.spend)),
      impressions,
      clicks,
      ctr: impressions > 0 ? (clicks / impressions) * 100 : null,
      cpc: clicks > 0 ? num(r.spend) / clicks : null,
    };
  });

  // 합계 + 전환
  const totalRows = await fetchInsights({ ...dp, fields: FIELDS });
  const t = totalRows[0] ?? {};
  const spend = Math.round(num(t.spend));
  const impressions = num(t.impressions);
  const clicks = num(t.clicks);
  const convEvents = conversionEvents(t);
  const convSum = sumConversions(convEvents);
  const landingViews = actionVal(t, "landing_page_view");

  // 분류별
  const [ageR, genderR, regionR, platR] = await Promise.all([
    fetchInsights({ ...dp, fields: FIELDS, breakdowns: "age" }),
    fetchInsights({ ...dp, fields: FIELDS, breakdowns: "gender" }),
    fetchInsights({ ...dp, fields: FIELDS, breakdowns: "region" }),
    fetchInsights({ ...dp, fields: FIELDS, breakdowns: "publisher_platform" }),
  ]);

  // 광고세트 / 소재
  const adsetR = await fetchInsights({ ...dp, level: "adset", fields: `${FIELDS},adset_name` });
  const adR = await fetchInsights({ ...dp, level: "ad", fields: `${FIELDS},ad_name` });

  const adsets: AdSet[] = adsetR.map((r) => {
    const clk = num(r.clicks);
    const imp = num(r.impressions);
    return {
      name: String(r.adset_name ?? "광고세트"),
      status: "ACTIVE",
      objective: "트래픽",
      spend: Math.round(num(r.spend)),
      impressions: imp,
      clicks: clk,
      ctr: imp > 0 ? (clk / imp) * 100 : null,
      cpc: clk > 0 ? num(r.spend) / clk : null,
      result: `구매 ${actionVal(r, "omni_purchase")}`,
    };
  });

  const creatives: Creative[] = adR.map((r) => {
    const clk = num(r.clicks);
    const imp = num(r.impressions);
    const name = String(r.ad_name ?? "소재");
    return {
      id: String(r.ad_id ?? name),
      name,
      type: /영상|video/i.test(name) ? "영상" : "이미지",
      objective: "트래픽",
      status: "ACTIVE",
      spend: Math.round(num(r.spend)),
      impressions: imp,
      clicks: clk,
      ctr: imp > 0 ? (clk / imp) * 100 : null,
      cpc: clk > 0 ? num(r.spend) / clk : null,
      result: `구매 ${actionVal(r, "omni_purchase")}`,
    };
  });

  return {
    account: SNAPSHOT.account,
    period: { since: String(t.date_start ?? ""), until: String(t.date_stop ?? ""), label },
    totals: {
      spend,
      impressions,
      clicks,
      ctr: impressions > 0 ? (clicks / impressions) * 100 : null,
      cpc: clicks > 0 ? spend / clicks : null,
      conversions: convSum.count,
      conversionValue: convSum.value,
      roas: spend > 0 && convSum.value > 0 ? convSum.value / spend : null,
    },
    daily,
    adsets: adsets.length ? adsets : SNAPSHOT.adsets,
    creatives: creatives.length ? creatives : SNAPSHOT.creatives,
    segments: {
      age: ageR.length ? ageR.map((r) => toSegment(r, "age")) : SNAPSHOT.segments.age,
      gender: genderR.length ? genderR.map((r) => toSegment(r, "gender")) : SNAPSHOT.segments.gender,
      region: regionR.length
        ? regionR.map((r) => toSegment(r, "region")).sort((a, b) => b.impressions - a.impressions).slice(0, 8)
        : SNAPSHOT.segments.region,
      platform: platR.length ? platR.map((r) => toSegment(r, "publisher_platform")) : SNAPSHOT.segments.platform,
    },
    conversions: { count: convSum.count, value: convSum.value, landingViews, events: convEvents },
  };
}

export async function GET(req: NextRequest) {
  const presetParam = (req.nextUrl.searchParams.get("preset") || "snapshot") as PresetKey;
  const label = PRESETS.find((p) => p.key === presetParam)?.label ?? SNAPSHOT.period.label;
  const fetchedAt = new Date().toISOString();

  // 토큰이 없거나 snapshot 선택 → 스냅샷 폴백
  if (!TOKEN || presetParam === "snapshot") {
    return NextResponse.json({
      data: { ...SNAPSHOT, period: { ...SNAPSHOT.period, label } },
      source: TOKEN ? "snapshot" : "snapshot-no-token",
      fetchedAt,
    });
  }

  try {
    const data = await buildLive(presetParam, label);
    return NextResponse.json({ data, source: "live", fetchedAt });
  } catch (e) {
    return NextResponse.json({
      data: { ...SNAPSHOT, period: { ...SNAPSHOT.period, label } },
      source: "snapshot-error",
      error: e instanceof Error ? e.message : "fetch failed",
      fetchedAt,
    });
  }
}
