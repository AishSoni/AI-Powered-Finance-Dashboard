import { memo, useEffect, useRef, type CSSProperties } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SpendingCategory {
  label:   string
  pct:     number   
  color:   string   
  amount:  number   
}

interface SpendingCompositionProps {
  categories:  SpendingCategory[]
  title?:      string
  onViewAll?:  () => void
}

// ─── Progress bar row ─────────────────────────────────────────────────────────

const BarRow = memo(function BarRow({
  label, pct, color, amount,
}: SpendingCategory) {
  const fillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = fillRef.current
    if (!el) return
    el.style.width = '0%'
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.width = `${pct}%`
      })
    })
    return () => cancelAnimationFrame(raf)
  }, [pct])

  const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

  return (
    <div style={s.barRow}>
      {/* Label row */}
      <div style={s.barLabelRow}>
        <span style={s.barLabel}>{label}</span>
        <div style={s.barMeta}>
          <span style={s.barAmount}>{fmt.format(amount)}</span>
          <span style={s.barPct}>{pct}%</span>
        </div>
      </div>

      {/* Track + fill */}
      <div style={s.track}>
        <div
          ref={fillRef}
          style={{ ...s.fill, background: color, width: '0%' }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}: ${pct}%`}
        />
      </div>
    </div>
  )
})

// ─── Component ────────────────────────────────────────────────────────────────

export const SpendingComposition = memo(function SpendingComposition({
  categories,
  title    = 'Spending Composition',
  onViewAll,
}: SpendingCompositionProps) {
  const highest = [...categories].sort((a, b) => b.pct - a.pct)[0]
  const avgMonthly = categories.reduce((sum, c) => sum + c.amount, 0) / categories.length

  const fmtAvg = new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 2,
  })

  return (
    <section style={s.card} aria-label="Spending Composition">

      {/* Header */}
      <div style={s.header}>
        <h3 style={s.title}>{title}</h3>
        <button
          style={s.viewAll}
          onClick={onViewAll}
          aria-label="View all spending categories"
        >
          View All
        </button>
      </div>

      {/* Bar rows */}
      <div style={s.bars}>
        {categories.map((cat) => (
          <BarRow key={cat.label} {...cat} />
        ))}
      </div>

      {/* Footer summary */}
      <div style={s.footer}>
        <div style={s.footerItem}>
          <span style={s.footerLabel}>Highest</span>
          <span style={s.footerValue}>{highest?.label ?? '—'}</span>
        </div>
        <div style={s.footerDivider} />
        <div style={s.footerItem}>
          <span style={s.footerLabel}>Avg / category</span>
          <span style={s.footerValue}>{fmtAvg.format(avgMonthly)}/mo</span>
        </div>
      </div>
    </section>
  )
})

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, CSSProperties> = {
  card: {
    background:   'var(--color-bg-surface)',
    border:       '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding:       24,
    display:      'flex',
    flexDirection:'column',
    gap:           20,
  },

  // Header
  header: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize:   16,
    fontFamily: 'var(--font-family)',
    fontWeight:  700,
    color:      'var(--color-text-primary)',
    margin:       0,
  },
  viewAll: {
    fontSize:   13,
    fontFamily: 'var(--font-family)',
    fontWeight:  500,
    color:      'var(--color-primary)',
    background: 'none',
    border:     'none',
    cursor:     'pointer',
    padding:     0,
    transition: 'opacity 0.12s ease',
  },

  // Bars
  bars: {
    display:       'flex',
    flexDirection: 'column',
    gap:            16,
  },
  barRow: {
    display:       'flex',
    flexDirection: 'column',
    gap:            7,
  },
  barLabelRow: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
  },
  barLabel: {
    fontSize:   13,
    fontFamily: 'var(--font-family)',
    fontWeight:  600,
    color:      'var(--color-text-primary)',
  },
  barMeta: {
    display:    'flex',
    alignItems: 'center',
    gap:         10,
  },
  barAmount: {
    fontSize:   12,
    fontFamily: 'var(--font-family)',
    color:      'var(--color-text-secondary)',
  },
  barPct: {
    fontSize:   13,
    fontFamily: 'var(--font-family)',
    fontWeight:  700,
    color:      'var(--color-text-primary)',
    minWidth:    32,
    textAlign:  'right',
  },
  track: {
    height:       6,
    borderRadius: 3,
    background:   'var(--color-bg-elevated)',
    overflow:     'hidden',
  },
  fill: {
    height:     '100%',
    borderRadius: 3,
    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Footer
  footer: {
    display:    'flex',
    alignItems: 'center',
    gap:         16,
    paddingTop:  16,
    borderTop:  '1px solid var(--color-border-subtle)',
  },
  footerDivider: {
    width:      1,
    height:     28,
    background: 'var(--color-border)',
    flexShrink: 0,
  },
  footerItem: {
    display:       'flex',
    flexDirection: 'column',
    gap:            3,
  },
  footerLabel: {
    fontSize:      10,
    fontFamily:   'var(--font-family)',
    fontWeight:    600,
    color:        'var(--color-text-tertiary)',
    textTransform:'uppercase',
    letterSpacing:'0.07em',
  },
  footerValue: {
    fontSize:   13,
    fontFamily: 'var(--font-family)',
    fontWeight:  700,
    color:      'var(--color-text-primary)',
  },
}
