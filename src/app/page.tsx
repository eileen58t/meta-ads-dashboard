import DashboardProvider from "@/components/DashboardProvider";
import Controls from "@/components/Controls";
import KpiCards from "@/components/KpiCards";
import ComparisonChart from "@/components/ComparisonChart";
import FunnelCard from "@/components/FunnelCard";
import EfficiencyRanking from "@/components/EfficiencyRanking";
import BreakdownTabs from "@/components/BreakdownTabs";
import CreativePanel from "@/components/CreativePanel";
import InsightCards from "@/components/InsightCards";
import ConversionWarning from "@/components/ConversionWarning";
import AiAnalysis from "@/components/AiAnalysis";
import ThemeToggle from "@/components/ThemeToggle";
import { SNAPSHOT, CONVERSION_DEFINITION } from "@/lib/data";

export default function Home() {
  return (
    <DashboardProvider initial={SNAPSHOT}>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
              Meta Ads · {SNAPSHOT.account.business}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              {SNAPSHOT.account.name} · 통합 대시보드
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              계정 {SNAPSHOT.account.id} · 통화 {SNAPSHOT.account.currency}(₩)
            </p>
          </div>
          <ThemeToggle />
        </header>

        {/* 컨트롤바: 기간 선택 · 자동 새로고침 · 소스 배지 */}
        <Controls />

        {/* 1. KPI 카드 (7) — 클릭 시 소재별 상세 모달 */}
        <div className="mt-5">
          <KpiCards />
        </div>
        <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
          KPI 카드를 누르면 소재별 상세가 열립니다 · 증감은 마지막 일자 vs 직전 일자 기준
        </p>

        {/* 2. 이중축 비교 차트 */}
        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <ComparisonChart />
        </section>

        {/* 3. 퍼널 + 효율 순위 */}
        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          <FunnelCard />
          <EfficiencyRanking />
        </section>

        {/* 4. 분류별 탭 차트 */}
        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <BreakdownTabs />
        </section>

        {/* 5. 소재별 패널 */}
        <section className="mt-6">
          <CreativePanel />
        </section>

        {/* 6. 인사이트 카드 */}
        <section className="mt-6">
          <InsightCards />
        </section>

        {/* 7. 전환 경고 */}
        <section className="mt-4">
          <ConversionWarning />
        </section>

        {/* 8. AI 분석 + 추천 액션 */}
        <section className="mt-6">
          <AiAnalysis />
        </section>

        <footer className="mt-10 border-t border-slate-200 pt-4 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
          데이터 출처: Meta Ads · {CONVERSION_DEFINITION} · 라이브 연동은 환경변수 META_ACCESS_TOKEN 설정 시 활성화(미설정 시 6/19~6/25 스냅샷) · 못 가져온 값은 미집계로 표기.
        </footer>
      </main>
    </DashboardProvider>
  );
}
