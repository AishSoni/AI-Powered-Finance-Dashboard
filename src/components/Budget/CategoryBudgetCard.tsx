import { memo, useEffect, useMemo, useState, type CSSProperties } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type CategoryStatus = 'FIXED' | 'HEALTHY' | 'CRITICAL' | 'OPTIMAL'

export interface CategoryBudgetCardProps {
  category: string
  iconColor: string
  status: CategoryStatus
  spent: number
  limit: number
}

// ─── Status configuration ─────────────────────────────────────────────────────

const STATUS_CONFIG: Record<CategoryStatus, { bg: string; color: string; barColor: string }> = {
  FIXED: {
    bg: 'var(--color-bg-elevated)',
    color: 'var(--color-text-secondary)',
    barColor: 'var(--color-text-tertiary)',
  },
  HEALTHY: {
    bg: 'var(--color-success-muted)',
    color: 'var(--color-success)',
    barColor: 'var(--color-success)',
  },
  CRITICAL: {
    bg: 'var(--color-error-muted)',
    color: 'var(--color-error)',
    barColor: 'var(--color-error)',
  },
  OPTIMAL: {
    bg: '#F5A62318',
    color: 'var(--color-warning-light)',
    barColor: 'var(--color-warning-light)',
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CategoryBudgetCard = memo(function CategoryBudgetCard({
  category,
  iconColor,
  status,
  spent,
  limit,
}: CategoryBudgetCardProps) {
  const [progressWidth, setProgressWidth] = useState(0)
  const percentage = useMemo(() => Math.round((spent / limit) * 100), [limit, spent])
  const config = useMemo(() => STATUS_CONFIG[status], [status])

  // Animate progress bar on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressWidth(percentage)
    }, 100)
    return () => clearTimeout(timer)
  }, [percentage])

  return (
    <article style={s.card}>
      {/* Top row: icon + category name | status badge */}
      <div style={s.header}>
        <div style={s.categoryRow}>
          <div style={{ ...s.icon, background: iconColor }} aria-hidden="true" />
          <span style={s.categoryName}>{category}</span>
        </div>
        <div
          style={{ ...s.statusBadge, background: config.bg, color: config.color }}
          aria-label={`Status: ${status.charAt(0)}${status.slice(1).toLowerCase()}`}
        >
          {status}
        </div>
      </div>

      {/* Amount */}
      <div style={s.amount}>
        <span style={s.spent}>${spent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        <span style={s.limit}> / ${limit.toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
      </div>

      {/* Progress bar */}
      <div
        style={s.track}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${category} budget progress`}
      >
        <div
          style={{
            ...s.fill,
            width: `${progressWidth}%`,
            background: config.barColor,
          }}
        />
      </div>

      {/* Percentage */}
      <div style={s.percentage}>{percentage}%</div>
    </article>
  )
})

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, CSSProperties> = {
  card: {
    background: 'var(--color-bg-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    flexShrink: 0,
  },
  categoryName: {
    fontSize: 13,
    fontFamily: 'var(--font-family)',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: 99,
    fontSize: 10,
    fontFamily: 'var(--font-family)',
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  amount: {
    fontSize: 14,
    fontFamily: 'var(--font-family)',
  },
  spent: {
    fontWeight: 700,
    color: 'var(--color-text-primary)',
  },
  limit: {
    fontWeight: 400,
    color: 'var(--color-text-secondary)',
  },
  track: {
    height: 8,
    background: 'var(--color-bg-elevated)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.8s ease',
  },
  percentage: {
    fontSize: 14,
    fontFamily: 'var(--font-family)',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    textAlign: 'right',
  },
}
