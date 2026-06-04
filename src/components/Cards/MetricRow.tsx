import type { CSSProperties } from 'react'
import { MetricCard, MetricCardSkeleton } from './MetricCard'
import { useFetch } from '@/hooks'
import { dashboardSummary, type DashboardSummary } from '@/data/mockData'

// ─── Fetcher (swappable with real API call) ────────────────────────────────────

function fetchSummary(): Promise<DashboardSummary> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(dashboardSummary), 800),
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MetricRow() {
  const { data, loading, error } = useFetch<DashboardSummary>(fetchSummary)

  if (error) {
    return (
      <div style={s.error} role="alert">
        Unable to load summary data. <button style={s.retryBtn} onClick={() => window.location.reload()}>Retry</button>
      </div>
    )
  }

  if (loading || !data) {
    return (
      <div style={s.row} aria-label="Loading metrics">
        <div style={s.heroCell}><MetricCardSkeleton hero /></div>
        <div style={s.cell}><MetricCardSkeleton /></div>
        <div style={s.cell}><MetricCardSkeleton /></div>
      </div>
    )
  }

  return (
    <div style={s.row} aria-label="Key financial metrics">
      {/* Net Worth — hero card, wider */}
      <div style={s.heroCell}>
        <MetricCard
          label="TOTAL NET WORTH"
          rawValue={data.netWorth}
          changeText="vs last month"
          changeType="positive"
          changePct="+12.4%"
          hero
        />
      </div>

      {/* Monthly Spending */}
      <div style={s.cell}>
        <MetricCard
          label="MONTHLY SPENDING"
          rawValue={data.monthlySpending}
          changeText="vs last month"
          changeType="negative"
          changePct="-3.1%"
        />
      </div>

      {/* Total Savings */}
      <div style={s.cell}>
        <MetricCard
          label="TOTAL SAVINGS"
          rawValue={data.totalSavings}
          changeText="On track for Q4 goal"
          changeType="goal"
        />
      </div>
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, CSSProperties> = {
  row: {
    display: 'grid',
    gridTemplateColumns: '1.8fr 1fr 1fr',
    gap:    16,
    alignItems: 'stretch',
  },
  heroCell: { minWidth: 0 },
  cell:     { minWidth: 0 },
  error: {
    padding:      '16px 20px',
    borderRadius: 'var(--radius-lg)',
    background:   'var(--color-error-muted)',
    color:        'var(--color-error)',
    fontSize:      13,
    fontFamily:   'var(--font-family)',
    display:      'flex',
    alignItems:   'center',
    gap:           12,
  },
  retryBtn: {
    fontSize:     12,
    fontFamily:  'var(--font-family)',
    fontWeight:   600,
    color:       'var(--color-error)',
    textDecoration:'underline',
    cursor:      'pointer',
    background:  'none',
    border:      'none',
    padding:      0,
  },
}
