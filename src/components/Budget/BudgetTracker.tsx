import type { CSSProperties, FC } from 'react'

export interface BudgetCategory {
  name: string
  spent: number
  limit: number
  color: string
}

interface BudgetTrackerProps {
  categories: BudgetCategory[]
  title?: string
}

const BudgetTracker: FC<BudgetTrackerProps> = ({ categories, title = 'Budget Overview' }) => {
  return (
    <div className="card" style={s.wrapper}>
      <div style={s.header}>
        <span style={s.title}>{title}</span>
        <span className="badge badge-warning">Jun 2026</span>
      </div>

      <div style={s.list}>
        {categories.map((cat) => {
          const pct = Math.min((cat.spent / cat.limit) * 100, 100)
          const isOver = cat.spent > cat.limit
          return (
            <div key={cat.name} style={s.item}>
              <div style={s.itemHeader}>
                <span style={s.catName}>{cat.name}</span>
                <span style={s.amounts}>
                  <span style={{ color: isOver ? 'var(--color-error)' : 'var(--color-text-primary)', fontWeight: 600 }}>
                    ${cat.spent.toLocaleString()}
                  </span>
                  <span style={s.limit}> / ${cat.limit.toLocaleString()}</span>
                </span>
              </div>
              {/* Progress bar */}
              <div style={s.track}>
                <div
                  style={{
                    ...s.fill,
                    width: `${pct}%`,
                    background: isOver
                      ? 'var(--color-error)'
                      : pct > 80
                      ? 'var(--color-warning-light)'
                      : cat.color,
                  }}
                />
              </div>
              <div style={s.itemFooter}>
                <span style={{ color: isOver ? 'var(--color-error)' : 'var(--color-text-tertiary)', ...s.footerText }}>
                  {isOver ? `${(cat.spent - cat.limit).toLocaleString()} over budget` : `${(cat.limit - cat.spent).toLocaleString()} remaining`}
                </span>
                <span style={{ ...s.footerText, color: isOver ? 'var(--color-error)' : 'var(--color-text-tertiary)' }}>
                  {pct.toFixed(0)}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const s: Record<string, CSSProperties> = {
  wrapper: { padding: 'var(--space-5)' },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 'var(--space-5)',
  },
  title: {
    font: 'var(--font-heading-sm)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-primary)',
  },
  list: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
  item: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  catName: {
    font: 'var(--font-body-md)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-primary)',
    fontWeight: 500,
  },
  amounts: {
    font: 'var(--font-body-sm)',
    fontFamily: 'var(--font-family)',
  },
  limit: {
    color: 'var(--color-text-tertiary)',
  },
  track: {
    height: '6px',
    background: 'var(--color-bg-elevated)',
    borderRadius: '99px',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: '99px',
    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  itemFooter: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  footerText: {
    font: 'var(--font-label-sm)',
    fontFamily: 'var(--font-family)',
  },
}

export default BudgetTracker
