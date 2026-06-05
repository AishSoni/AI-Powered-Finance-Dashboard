import { memo, type CSSProperties, type FC } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface InsightCardProps {
  id?:   string
  tag?:  string
  title: string
  body:  string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const InsightCard: FC<InsightCardProps> = memo(function InsightCard({ tag, title, body }) {
  return (
  <div style={s.card}>
    <div style={s.header}>
      <span style={s.dot} aria-hidden="true" />
      <span style={s.tag}>{tag ?? 'AI Insight'}</span>
    </div>
    <div style={s.title}>{title}</div>
    <div style={s.body}>{body}</div>
  </div>
  )
})

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, CSSProperties> = {
  card: {
    background:   'var(--color-primary-muted)',
    border:       '1px solid rgba(0,88,190,0.2)',
    borderRadius: 'var(--radius-lg)',
    padding:       16,
    display:      'flex',
    flexDirection:'column',
    gap:            6,
  },
  header: {
    display:    'flex',
    alignItems: 'center',
    gap:         7,
  },
  dot: {
    width:        6,
    height:       6,
    borderRadius: '50%',
    background:   'var(--color-primary)',
    flexShrink:   0,
  },
  tag: {
    fontSize:      10,
    fontFamily:   'var(--font-family)',
    fontWeight:    700,
    color:        'var(--color-primary)',
    textTransform:'uppercase',
    letterSpacing:'0.08em',
  },
  title: {
    fontSize:   13,
    fontFamily: 'var(--font-family)',
    fontWeight:  600,
    color:      'var(--color-text-primary)',
    lineHeight:  1.35,
  },
  body: {
    fontSize:   12,
    fontFamily: 'var(--font-family)',
    color:      'var(--color-text-secondary)',
    lineHeight:  1.5,
  },
}
