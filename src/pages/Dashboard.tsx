import type { CSSProperties, FC } from 'react'
import PageHeader from '@/components/Header/PageHeader'
import { MetricCard, InsightCard } from '@/components/Cards/MetricCard'
import TransactionList from '@/components/Transactions/TransactionList'
import BudgetTracker from '@/components/Budget/BudgetTracker'
import { kpiStats, aiInsights, mockTransactions, budgetCategories, portfolioAllocation } from '@/data/mockData'

// ── Mini portfolio donut ───────────────────────────────────────────────────────
const PortfolioDonut: FC = () => {
  // Build conic-gradient from allocation data
  let cursor = 0
  const stops = portfolioAllocation.map((slice) => {
    const from = cursor
    cursor += slice.pct
    return `${slice.color} ${from}% ${cursor}%`
  })
  const gradient = `conic-gradient(${stops.join(', ')})`

  return (
    <div className="card" style={s.donutCard}>
      <div style={s.donutHeader}>
        <span style={s.cardTitle}>Asset Allocation</span>
        <span className="badge badge-primary">Live</span>
      </div>

      <div style={s.donutWrap}>
        <div style={{ ...s.donut, background: gradient }}>
          <div style={s.donutHole}>
            <div style={s.donutTotal}>$1.25M</div>
            <div style={s.donutSub}>Total AUM</div>
          </div>
        </div>
      </div>

      <div style={s.legend}>
        {portfolioAllocation.map((slice) => (
          <div key={slice.name} style={s.legendRow}>
            <div style={{ ...s.legendDot, background: slice.color }} />
            <span style={s.legendName}>{slice.name}</span>
            <span style={s.legendPct}>{slice.pct}%</span>
            <span style={s.legendVal}>{slice.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Alert banner ──────────────────────────────────────────────────────────────
const AlertBanner: FC<{ message: string; type: 'warning' | 'error' }> = ({ message, type }) => {
  const bg   = type === 'error' ? 'var(--color-error-muted)'   : 'rgba(245,166,35,0.09)'
  const color= type === 'error' ? 'var(--color-error)'          : 'var(--color-warning-light)'
  const icon = type === 'error' ? '⚠' : '◈'
  return (
    <div style={{ ...s.alert, background: bg, borderColor: color }}>
      <span style={{ color, fontSize: '0.875rem' }}>{icon}</span>
      <span style={{ ...s.alertText, color }}>{message}</span>
    </div>
  )
}

// ── Main Dashboard page ───────────────────────────────────────────────────────
const Dashboard: FC = () => {
  return (
    <div style={s.page}>
      <PageHeader
        title="Wealth Dashboard"
        subtitle="Q2 2026 · Proton Finance"
        actions={
          <>
            <button className="btn-ghost" id="export-btn">Export PDF</button>
            <button className="btn-primary" id="add-account-btn">+ Add Account</button>
          </>
        }
      />

      {/* ── Alert strip ── */}
      <div style={s.alertStrip}>
        <AlertBanner type="warning" message="Entertainment budget is 87% spent — 11 days remaining in June." />
      </div>

      {/* ── Bento row 1: KPI cards ── */}
      <div style={s.kpiGrid} aria-label="Key performance indicators">
        {kpiStats.map((stat) => (
          <MetricCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            subLabel={stat.subLabel}
            accent={stat.id === 'aum'}
          />
        ))}
      </div>

      {/* ── Bento row 2: Donut + AI Insights + Budget ── */}
      <div style={s.row2}>
        {/* Column A: Portfolio donut */}
        <div style={s.colA}>
          <PortfolioDonut />
        </div>

        {/* Column B: AI Insights */}
        <div style={s.colB}>
          <div style={s.colBHeader}>
            <span style={s.sectionTitle}>AI Insights</span>
          </div>
          <div style={s.insightsList}>
            {aiInsights.map((insight) => (
              <InsightCard key={insight.id} {...insight} />
            ))}
          </div>
        </div>

        {/* Column C: Budget tracker */}
        <div style={s.colC}>
          <BudgetTracker categories={budgetCategories} />
        </div>
      </div>

      {/* ── Bento row 3: Transactions (full-width) ── */}
      <div style={s.row3}>
        <TransactionList transactions={mockTransactions} />
      </div>
    </div>
  )
}

export default Dashboard

/* ── Styles ── */
const s: Record<string, CSSProperties> = {
  page: {
    padding: 'var(--space-6)',
    maxWidth: 'var(--content-max-width)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-4)',
  },
  alertStrip: {},
  alert: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    padding: 'var(--space-3) var(--space-4)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid transparent',
  },
  alertText: {
    font: 'var(--font-body-sm)',
    fontFamily: 'var(--font-family)',
    fontWeight: 500,
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 'var(--space-4)',
  },
  row2: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr 280px',
    gap: 'var(--space-4)',
    alignItems: 'start',
  },
  colA: {},
  colB: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' },
  colBHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    font: 'var(--font-heading-sm)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-primary)',
  },
  insightsList: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' },
  colC: {},
  row3: {},

  // Donut
  donutCard: { padding: 'var(--space-5)' },
  donutHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 'var(--space-5)',
  },
  cardTitle: {
    font: 'var(--font-heading-sm)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-primary)',
  },
  donutWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 'var(--space-5)',
  },
  donut: {
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-elevated)',
  },
  donutHole: {
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    background: 'var(--color-bg-surface)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
  },
  donutTotal: {
    font: 'var(--font-heading-md)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-primary)',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
  },
  donutSub: {
    font: 'var(--font-label-sm)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-tertiary)',
  },
  legend: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' },
  legendRow: {
    display: 'grid',
    gridTemplateColumns: '8px 1fr auto auto',
    alignItems: 'center',
    gap: 'var(--space-2)',
  },
  legendDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  legendName: {
    font: 'var(--font-body-sm)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-secondary)',
  },
  legendPct: {
    font: 'var(--font-label-md)',
    fontFamily: 'var(--font-family)',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    minWidth: '30px',
    textAlign: 'right',
  },
  legendVal: {
    font: 'var(--font-label-md)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-tertiary)',
    minWidth: '60px',
    textAlign: 'right',
  },
}
