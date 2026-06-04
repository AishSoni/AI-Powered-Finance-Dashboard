import { memo, type CSSProperties } from 'react'
import { TrendingUp, TrendingDown, CheckCircle } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChangeType = 'positive' | 'negative' | 'neutral' | 'goal'

export interface MetricCardProps {
  label: string
  rawValue: number
  compact?: boolean
  changeText: string
  changeType: ChangeType
  changePct?: string
  hero?: boolean
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = new Intl.NumberFormat('en-US', {
  style:    'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const fmtCompact = new Intl.NumberFormat('en-US', {
  style:             'currency',
  currency:          'USD',
  notation:          'compact',
  maximumFractionDigits: 2,
})

function formatValue(raw: number, compact: boolean) {
  return compact ? fmtCompact.format(raw) : fmt.format(raw)
}

// ─── Change badge ─────────────────────────────────────────────────────────────

function ChangeBadge({ pct, text, type }: { pct?: string; text: string; type: ChangeType }) {
  if (type === 'goal') {
    return (
      <div style={badge.goal}>
        <CheckCircle size={12} strokeWidth={2.5} />
        <span>{text}</span>
      </div>
    )
  }

  const isPos   = type === 'positive'
  const isNeg   = type === 'negative'
  const color   = isPos ? 'var(--color-success)' : isNeg ? 'var(--color-error)' : 'var(--color-text-tertiary)'
  const bg      = isPos ? 'var(--color-success-muted)' : isNeg ? 'var(--color-error-muted)' : 'transparent'

  return (
    <div style={{ ...badge.base, color, background: bg }}>
      {isPos && <TrendingUp  size={12} strokeWidth={2.5} />}
      {isNeg && <TrendingDown size={12} strokeWidth={2.5} />}
      {pct && <span style={badge.pct}>{pct}</span>}
      <span style={badge.text}>{text}</span>
    </div>
  )
}

const badge: Record<string, CSSProperties> = {
  base: {
    display:    'inline-flex',
    alignItems: 'center',
    gap:         4,
    padding:    '3px 8px',
    borderRadius: 99,
    fontSize:    12,
    fontFamily: 'var(--font-family)',
    fontWeight:  500,
  },
  goal: {
    display:    'inline-flex',
    alignItems: 'center',
    gap:         5,
    fontSize:    12,
    fontFamily: 'var(--font-family)',
    fontWeight:  500,
    color:      'var(--color-success)',
  },
  pct: { fontWeight: 600 },
  text: { opacity: 0.85 },
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

export const MetricCard = memo(function MetricCard({
  label,
  rawValue,
  compact  = false,
  changeText,
  changeType,
  changePct,
  hero     = false,
}: MetricCardProps) {
  return (
    <article style={s.card} aria-label={label}>
      <div style={s.label}>{label}</div>

      <div style={hero ? s.valueHero : s.value}>
        {formatValue(rawValue, compact)}
      </div>

      <ChangeBadge pct={changePct} text={changeText} type={changeType} />
    </article>
  )
})

// ─── Shimmer skeleton (reused by MetricRow) ───────────────────────────────────

export function MetricCardSkeleton({ hero = false }: { hero?: boolean }) {
  return (
    <div style={{ ...s.card, gap: 12 }} aria-busy="true" aria-label="Loading metric">
      <div style={sk.label} />
      <div style={hero ? sk.valueHero : sk.value} />
      <div style={sk.badge} />
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, CSSProperties> = {
  card: {
    background:   'var(--color-bg-surface)',
    border:       '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding:       24,
    display:      'flex',
    flexDirection:'column',
    gap:            8,
    transition:   'box-shadow 0.15s ease',
  },
  label: {
    fontSize:      11,
    fontFamily:   'var(--font-family)',
    fontWeight:    600,
    color:        'var(--color-text-secondary)',
    textTransform:'uppercase',
    letterSpacing:'0.08em',
  },
  value: {
    font:         'var(--font-display-md)',
    fontFamily:   'var(--font-family)',
    color:        'var(--color-text-primary)',
    letterSpacing:'-0.03em',
    lineHeight:    1.05,
  },
  valueHero: {
    font:         'var(--font-display-lg)',
    fontFamily:   'var(--font-family)',
    color:        'var(--color-text-primary)',
    letterSpacing:'-0.03em',
    lineHeight:    1.05,
  },
}

// Shimmer animation applied via a keyframe class
const SHIMMER: CSSProperties = {
  background:   'linear-gradient(90deg, var(--color-bg-elevated) 25%, var(--color-bg-input) 50%, var(--color-bg-elevated) 75%)',
  backgroundSize:'200% 100%',
  animation:    'shimmer 1.4s ease infinite',
  borderRadius:  6,
}

const sk: Record<string, CSSProperties> = {
  label:     { ...SHIMMER, height: 11, width: '55%' },
  value:     { ...SHIMMER, height: 36, width: '75%' },
  valueHero: { ...SHIMMER, height: 52, width: '80%' },
  badge:     { ...SHIMMER, height: 22, width: '60%', borderRadius: 99 },
}
