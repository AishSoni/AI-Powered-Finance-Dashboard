import type { CSSProperties, FC } from 'react'

interface MetricCardProps {
  label: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  subLabel?: string
  icon?: React.ReactNode
  accent?: boolean
}

export const MetricCard: FC<MetricCardProps> = ({
  label,
  value,
  change,
  changeType = 'neutral',
  subLabel,
  icon,
  accent = false,
}) => {
  const changeColor =
    changeType === 'positive'
      ? 'var(--color-success)'
      : changeType === 'negative'
      ? 'var(--color-error)'
      : 'var(--color-text-tertiary)'

  return (
    <div style={{ ...s.card, ...(accent ? s.cardAccent : {}) }} className="card">
      <div style={s.topRow}>
        <span style={s.label}>{label}</span>
        {icon && <span style={s.icon}>{icon}</span>}
      </div>
      <div style={s.value}>{value}</div>
      <div style={s.bottomRow}>
        {change && (
          <span style={{ ...s.change, color: changeColor }}>
            {changeType === 'positive' ? '▲' : changeType === 'negative' ? '▼' : ''} {change}
          </span>
        )}
        {subLabel && <span style={s.subLabel}>{subLabel}</span>}
      </div>
    </div>
  )
}

/* ── AI Insight Card ───────────────────────────────────────────────────────── */
interface InsightCardProps {
  title: string
  body: string
  tag?: string
}

export const InsightCard: FC<InsightCardProps> = ({ title, body, tag }) => (
  <div style={s.insightCard}>
    <div style={s.insightHeader}>
      <span style={s.insightDot} />
      <span style={s.insightTag}>{tag ?? 'AI Insight'}</span>
    </div>
    <div style={s.insightTitle}>{title}</div>
    <div style={s.insightBody}>{body}</div>
  </div>
)

/* ── Styles ── */
const s: Record<string, CSSProperties> = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
  },
  cardAccent: {
    borderColor: 'rgba(0,88,190,0.3)',
    background: 'linear-gradient(135deg, var(--color-bg-surface) 0%, rgba(0,88,190,0.05) 100%)',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    font: 'var(--font-label-md)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-secondary)',
    letterSpacing: '0.02em',
  },
  icon: {
    color: 'var(--color-text-tertiary)',
    display: 'flex',
  },
  value: {
    font: 'var(--font-display-md)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.03em',
    lineHeight: 1.1,
  },
  bottomRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    flexWrap: 'wrap',
  },
  change: {
    font: 'var(--font-label-md)',
    fontFamily: 'var(--font-family)',
    fontWeight: 500,
  },
  subLabel: {
    font: 'var(--font-label-md)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-tertiary)',
  },
  insightCard: {
    background: 'var(--color-primary-muted)',
    border: '1px solid rgba(0,88,190,0.2)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-5)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
  },
  insightHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
  },
  insightDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'var(--color-primary)',
    animation: 'pulse 2s infinite',
    flexShrink: 0,
  },
  insightTag: {
    font: 'var(--font-label-sm)',
    fontFamily: 'var(--font-family)',
    fontWeight: 600,
    color: 'var(--color-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  insightTitle: {
    font: 'var(--font-heading-sm)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-primary)',
  },
  insightBody: {
    font: 'var(--font-body-sm)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.55,
  },
}
