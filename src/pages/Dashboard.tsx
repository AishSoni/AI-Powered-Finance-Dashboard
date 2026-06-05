import { useMemo, type CSSProperties, type FC } from 'react'
import PageHeader from '@/components/Header/PageHeader'
import MetricRow from '@/components/Cards/MetricRow'
import { ProStrategyCard } from '@/components/AIInsights/ProStrategyCard'
import { InsightCard } from '@/components/AIInsights/InsightCard'
import { ActiveAlertsPreview } from '@/components/Cards/ActiveAlertsPreview'
import BudgetTracker from '@/components/Budget/BudgetTracker'
import { SpendingComposition } from '@/components/Spending/SpendingComposition'
import RecentActivity from '@/components/Transactions/RecentActivity'
import {
  aiInsights, budgetCategories, portfolioAllocation,
  activeAlerts, spendingCategories,
} from '@/data/mockData'
import './Dashboard.css'

// ─── Portfolio donut ──────────────────────────────────────────────────────────

const PortfolioDonut: FC = () => {
  const stops = useMemo(() => (
    portfolioAllocation.reduce<{ cursor: number; stops: string[] }>((acc, slice) => {
      const nextCursor = acc.cursor + slice.pct
      return {
        cursor: nextCursor,
        stops: [...acc.stops, `${slice.color} ${acc.cursor}% ${nextCursor}%`],
      }
    }, { cursor: 0, stops: [] }).stops
  ), [])

  return (
    <div className="card" style={s.donutCard}>
      <div style={s.donutHeader}>
        <span style={s.cardTitle}>Asset Allocation</span>
        <span className="badge badge-primary">Live</span>
      </div>
      <div style={s.donutWrap}>
        <div style={{ ...s.donut, background: `conic-gradient(${stops.join(', ')})` }}>
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

// ─── Dashboard page ───────────────────────────────────────────────────────────

const Dashboard: FC = () => {
  return (
    <div className="dashboard-page" style={s.page}>

      {/* ── Page header ── */}
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

      {/* ── Row 1: Metric cards + Active Alerts ── */}
      <div className="dashboard-row1" style={s.row1}>
        <div className="dashboard-metric-col" style={s.metricCol}>
          <MetricRow />
        </div>
        <div className="dashboard-alert-col" style={s.alertCol}>
          <ActiveAlertsPreview alerts={activeAlerts} compact />
        </div>
      </div>

      {/* ── Row 2: Pro Strategy hero card ── */}
      <div className="dashboard-strategy-card">
        <ProStrategyCard
          insightId="strategy-q3-2026"
          headline="Optimizing your portfolio for the upcoming Q3 market shift."
          body="Our AI models detect elevated volatility signals in growth equities. Rotating 8% of your NVDA position into short-duration Treasuries could reduce drawdown risk by an estimated 14% while preserving 92% of upside capture."
        />
      </div>

      {/* ── Row 3: Donut + AI Insights + Budget ── */}
      <div className="dashboard-row3" style={s.row3}>
        <div className="dashboard-col3a" style={s.col3A}>
          <PortfolioDonut />
        </div>
        <div className="dashboard-col3b" style={s.col3B}>
          <div style={s.sectionTitle}>AI Insights</div>
          <div style={s.insightsList}>
            {aiInsights.map((insight) => (
              <InsightCard key={insight.id} {...insight} />
            ))}
          </div>
        </div>
        <div className="dashboard-col3c" style={s.col3C}>
          <BudgetTracker categories={budgetCategories} />
        </div>
      </div>

      <div className="dashboard-row4" style={s.row4}>
        <div className="dashboard-spending-col" style={s.spendingCol}>
          <SpendingComposition categories={spendingCategories} />
        </div>
        <div className="dashboard-activity-col" style={s.activityCol}>
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}

export default Dashboard

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, CSSProperties> = {
  page: {
    padding:       'var(--space-6)',
    maxWidth:      'var(--content-max-width)',
    display:       'flex',
    flexDirection: 'column',
    gap:            16,
  },

  // Row 1: metrics (flex-1) + alerts panel (fixed 260px)
  row1: {
    display:    'flex',
    gap:         16,
    alignItems: 'flex-start',
  },
  metricCol: { flex: 1, minWidth: 0 },
  alertCol:  { width: 260, flexShrink: 0 },

  // Row 3: 3-col bento
  row3: {
    display:             'grid',
    gridTemplateColumns: '300px 1fr 280px',
    gap:                  16,
    alignItems:          'start',
  },
  col3A: {},
  col3B: { display: 'flex', flexDirection: 'column', gap: 12 },
  col3C: {},

  row4: {
    display:             'grid',
    gridTemplateColumns: '1fr 1.6fr',
    gap:                  16,
    alignItems:          'start',
  },
  spendingCol: {},
  activityCol: {},

  sectionTitle: {
    fontSize:   14,
    fontFamily: 'var(--font-family)',
    fontWeight:  700,
    color:      'var(--color-text-primary)',
    marginBottom: 4,
  },
  insightsList: { display: 'flex', flexDirection: 'column', gap: 10 },

  // Donut card
  donutCard: { padding: 20 },
  donutHeader: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginBottom:    16,
  },
  cardTitle: {
    fontSize:   14,
    fontFamily: 'var(--font-family)',
    fontWeight:  700,
    color:      'var(--color-text-primary)',
  },
  donutWrap: {
    display:        'flex',
    justifyContent: 'center',
    marginBottom:    16,
  },
  donut: {
    width:        160,
    height:       160,
    borderRadius: '50%',
    display:      'flex',
    alignItems:   'center',
    justifyContent:'center',
    boxShadow:    'var(--shadow-elevated)',
  },
  donutHole: {
    width:         96,
    height:        96,
    borderRadius: '50%',
    background:   'var(--color-bg-surface)',
    display:      'flex',
    flexDirection:'column',
    alignItems:   'center',
    justifyContent:'center',
    gap:           2,
  },
  donutTotal: {
    fontSize:     16,
    fontFamily:  'var(--font-family)',
    fontWeight:   700,
    color:       'var(--color-text-primary)',
    letterSpacing:'-0.02em',
    lineHeight:   1.1,
  },
  donutSub: {
    fontSize:   10,
    fontFamily: 'var(--font-family)',
    color:      'var(--color-text-tertiary)',
  },
  legend:    { display: 'flex', flexDirection: 'column', gap: 8 },
  legendRow: {
    display:             'grid',
    gridTemplateColumns: '8px 1fr auto auto',
    alignItems:          'center',
    gap:                  8,
  },
  legendDot:  { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  legendName: { fontSize: 12, fontFamily: 'var(--font-family)', color: 'var(--color-text-secondary)' },
  legendPct:  { fontSize: 12, fontFamily: 'var(--font-family)', fontWeight: 600, color: 'var(--color-text-primary)', minWidth: 28, textAlign: 'right' },
  legendVal:  { fontSize: 12, fontFamily: 'var(--font-family)', color: 'var(--color-text-tertiary)', minWidth: 60, textAlign: 'right' },
}
