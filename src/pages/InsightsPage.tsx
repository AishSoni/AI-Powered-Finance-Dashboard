import type { CSSProperties } from 'react'
import PageHeader from '@/components/Header/PageHeader'
import { InsightCard } from '@/components/AIInsights/InsightCard'
import { ProStrategyCard } from '@/components/AIInsights/ProStrategyCard'
import { aiInsights } from '@/data/mockData'

export default function InsightsPage() {
  return (
    <div style={s.page}>
      <PageHeader
        title="AI Insights"
        subtitle="Strategy signals and financial recommendations"
      />

      <ProStrategyCard
        insightId="strategy-insights-2026"
        headline="Optimizing your portfolio for the upcoming Q3 market shift."
        body="AI models detect elevated volatility in growth equities. A measured rotation into short-duration Treasuries can reduce drawdown exposure while preserving upside capture."
      />

      <section style={s.list} aria-label="Financial insights">
        {aiInsights.map((insight) => (
          <InsightCard key={insight.id} {...insight} />
        ))}
      </section>
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
}
