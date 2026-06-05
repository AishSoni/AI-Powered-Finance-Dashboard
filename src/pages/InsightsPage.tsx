import { useMemo, type CSSProperties } from 'react'
import PageHeader from '@/components/Header/PageHeader'
import { InsightCard } from '@/components/AIInsights/InsightCard'
import { ProStrategyCard } from '@/components/AIInsights/ProStrategyCard'
import { mockTransactions, budgetPageData } from '@/data/mockData'
import { generateInsights } from '@/utils/insightsEngine'
import { useAnalytics, ANALYTICS_EVENTS } from '@/hooks'
import { useEffect } from 'react'

export default function InsightsPage() {
  const { trackEvent } = useAnalytics()

  // Derive dynamic insights from real mock data on every render
  const insights = useMemo(
    () => generateInsights(mockTransactions, budgetPageData),
    [],
  )

  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.PAGE_VIEW, { page: 'insights', insight_count: insights.length })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <div style={s.page}>
      <PageHeader
        title="AI Insights"
        subtitle="Strategy signals and financial recommendations"
      />

      {/* ── Pro strategy hero — static flagship card ── */}
      <ProStrategyCard
        insightId="strategy-insights-2026"
        headline="Optimizing your portfolio for the upcoming Q3 market shift."
        body="AI models detect elevated volatility in growth equities. A measured rotation into short-duration Treasuries can reduce drawdown exposure while preserving upside capture."
      />

      {/* ── Dynamic insight cards from insightsEngine ── */}
      {insights.length > 0 && (
        <section style={s.list} aria-label="Financial insights" aria-live="polite">
          {insights.map((insight) => (
            <InsightCard
              key={insight.id}
              id={insight.id}
              tag={insight.tag}
              title={insight.title}
              body={insight.body}
            />
          ))}
        </section>
      )}

      {insights.length === 0 && (
        <p style={s.empty}>All budgets are on track — no active recommendations.</p>
      )}
    </div>
  )
}

const s: Record<string, CSSProperties> = {
  page: {
    padding: 'var(--space-6)',
    maxWidth: 'var(--content-max-width)',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  list: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 16,
  },
  empty: {
    fontSize: 14,
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-tertiary)',
    textAlign: 'center',
    padding: '32px 0',
  },
}
