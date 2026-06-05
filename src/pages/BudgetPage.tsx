import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react'
import { ANALYTICS_EVENTS, useAnalytics, useFetch } from '@/hooks'
import { fetchBudget, budgetPageData } from '@/data/mockData'
import { CategoryBudgetCard } from '@/components/Budget/CategoryBudgetCard'
import { BudgetStrategyCard } from '@/components/AIInsights/BudgetStrategyCard'
import { AlertsPanel } from '@/components/Alerts/AlertsPanel'
import { activeAlerts } from '@/data/mockData'

// ─── Component ────────────────────────────────────────────────────────────────

const BudgetPage = () => {
  const { data, loading } = useFetch(fetchBudget, [])
  const { trackEvent } = useAnalytics()
  const [progressWidth, setProgressWidth] = useState(0)

  const budgetData = data || budgetPageData
  const velocityPercentage = useMemo(
    () => Math.round((budgetData.totalSpent / budgetData.totalLimit) * 100),
    [budgetData.totalLimit, budgetData.totalSpent],
  )

  const categories = useMemo(() => budgetData.categories, [budgetData.categories])

  const handleAdjustLimits = useCallback(() => {
    trackEvent(ANALYTICS_EVENTS.BUDGET_LIMIT_ADJUSTED)
  }, [trackEvent])

  // Animate velocity progress bar on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressWidth(velocityPercentage)
    }, 100)
    return () => clearTimeout(timer)
  }, [velocityPercentage])

  return (
    <div style={s.page}>
      {/* ── Page Header ── */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Monthly Overview</h1>
          <p style={s.subtitle}>Fiscal Period: {budgetData.fiscalPeriod}</p>
        </div>
        <button style={s.adjustButton} onClick={handleAdjustLimits}>Adjust Limits</button>
      </div>

      {/* ── Main Content: 2-column layout ── */}
      <div style={s.content}>
        {/* Left Column (65%) */}
        <div style={s.leftColumn}>
          {/* Budget Velocity Section */}
          <section style={s.velocitySection}>
            <div style={s.velocityLabel}>TOTAL BUDGET VELOCITY</div>
            <div style={s.velocityAmount}>
              ${budgetData.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              <span style={s.velocityLimit}>
                {' '} / ${budgetData.totalLimit.toLocaleString('en-US', { minimumFractionDigits: 0 })}
              </span>
            </div>
            
            {/* Progress bar */}
            <div
              style={s.velocityTrack}
              role="progressbar"
              aria-valuenow={velocityPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Total budget velocity progress"
            >
              <div
                style={{
                  ...s.velocityFill,
                  width: `${progressWidth}%`,
                }}
              />
            </div>
            
            {/* Below bar info */}
            <div style={s.velocityFooter}>
              <span style={s.velocityFooterLeft}>{velocityPercentage}% of monthly limit reached</span>
              <span style={s.velocityFooterRight}>{budgetData.daysRemaining} days remaining</span>
            </div>
          </section>

          {/* Right Stats Panel */}
          <section style={s.statsPanel}>
            <div>
              <div style={s.statsLabel}>PROJECTED SURPLUS</div>
              <div style={s.statsValueSuccess}>+${budgetData.projectedSurplus.toLocaleString('en-US', { minimumFractionDigits: 0 })}</div>
            </div>
            <div style={s.statsDivider} />
            <div>
              <div style={s.statsLabel}>SAVINGS EFFICIENCY</div>
              <div style={s.statsValueWhite}>{budgetData.savingsEfficiency}%</div>
            </div>
          </section>

          {/* Category Allocation Grid */}
          <section style={s.categorySection}>
            <div style={s.categoryHeader}>
              <h2 style={s.categoryTitle}>Category Allocation</h2>
              <a href="#" style={s.viewAllLink}>View All Categories</a>
            </div>
            <div style={s.categoryGrid}>
              {categories.map((cat) => (
                <CategoryBudgetCard
                  key={cat.category}
                  category={cat.category}
                  iconColor={cat.iconColor}
                  status={cat.status}
                  spent={cat.spent}
                  limit={cat.limit}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar (35%) */}
        <div style={s.rightColumn}>
          {/* Budget Strategy Card */}
          <BudgetStrategyCard
            insightId="budget-strategy-oct-2023"
            headline="Reduce entertainment spending by reallocating"
            highlight="$270"
            highlightSuffix="from transportation budget"
          />

          {/* Alerts Panel */}
          <div style={s.alertsWrapper}>
            <AlertsPanel alerts={activeAlerts} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BudgetPage

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, CSSProperties> = {
  page: {
    padding: 'var(--space-6)',
    maxWidth: 'var(--content-max-width)',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  title: {
    font: 'var(--font-display-sm)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-primary)',
    margin: 0,
  },
  subtitle: {
    font: 'var(--font-body-sm)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-secondary)',
    margin: '4px 0 0 0',
  },
  adjustButton: {
    padding: '8px 16px',
    background: 'transparent',
    color: 'var(--color-primary)',
    fontSize: 13,
    fontFamily: 'var(--font-family)',
    fontWeight: 600,
    border: '1px solid var(--color-primary)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all 0.12s ease',
    whiteSpace: 'nowrap',
  },
  content: {
    display: 'flex',
    gap: 20,
    alignItems: 'flex-start',
  },
  leftColumn: {
    flex: '0 0 65%',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  rightColumn: {
    flex: '0 0 35%',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  velocitySection: {
    background: 'var(--color-bg-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  velocityLabel: {
    fontSize: 11,
    fontFamily: 'var(--font-family)',
    fontWeight: 700,
    color: 'var(--color-text-secondary)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  velocityAmount: {
    font: 'var(--font-display-lg)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-primary)',
    display: 'flex',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  velocityLimit: {
    font: 'var(--font-body-md)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-secondary)',
  },
  velocityTrack: {
    height: 10,
    background: 'var(--color-bg-elevated)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  velocityFill: {
    height: '100%',
    background: 'var(--color-primary)',
    borderRadius: 5,
    transition: 'width 0.8s ease',
  },
  velocityFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  velocityFooterLeft: {
    fontSize: 12,
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-secondary)',
  },
  velocityFooterRight: {
    fontSize: 12,
    fontFamily: 'var(--font-family)',
    color: 'var(--color-primary)',
    cursor: 'pointer',
    fontWeight: 500,
  },
  statsPanel: {
    background: 'var(--color-bg-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  statsLabel: {
    fontSize: 11,
    fontFamily: 'var(--font-family)',
    fontWeight: 700,
    color: 'var(--color-text-secondary)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statsValueSuccess: {
    font: 'var(--font-display-md)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-success)',
  },
  statsValueWhite: {
    font: 'var(--font-display-md)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-primary)',
  },
  statsDivider: {
    height: 1,
    background: 'var(--color-border)',
    margin: 0,
  },
  categorySection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryTitle: {
    font: 'var(--font-heading-lg)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-primary)',
    margin: 0,
  },
  viewAllLink: {
    fontSize: 13,
    fontFamily: 'var(--font-family)',
    color: 'var(--color-primary)',
    textDecoration: 'none',
    fontWeight: 500,
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16,
  },
  alertsWrapper: {
    flex: 1,
  },
}
