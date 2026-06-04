import { memo, type CSSProperties } from 'react'
import { useAnalytics, ANALYTICS_EVENTS } from '@/hooks'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProStrategyCardProps {
  insightId:   string
  headline:    string
  body:        string
  badgeLabel?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ProStrategyCard = memo(function ProStrategyCard({
  insightId,
  headline,
  body,
  badgeLabel = 'PRO STRATEGY INSIGHT',
}: ProStrategyCardProps) {
  const { trackCTAClick, trackEvent } = useAnalytics()

  const handleExecute = () => {
    trackCTAClick('Execute Strategy', insightId)
  }

  const handleReview = () => {
    trackEvent(ANALYTICS_EVENTS.REVIEW_AUDIT_CLICKED, { insight_id: insightId })
  }

  return (
    <article style={s.card} aria-label="Pro Strategy Insight">

      {/* Badge */}
      <div style={s.badge}>{badgeLabel}</div>

      {/* Headline */}
      <h2 style={s.headline}>{headline}</h2>

      {/* Body */}
      <p style={s.body}>{body}</p>

      {/* Actions */}
      <div style={s.actions}>
        <button
          id={`execute-strategy-${insightId}`}
          style={s.btnPrimary}
          onClick={handleExecute}
          aria-label="Execute this investment strategy"
        >
          Execute Strategy
        </button>
        <button
          id={`review-audit-${insightId}`}
          style={s.btnGhost}
          onClick={handleReview}
          aria-label="Review the full strategy audit"
        >
          Review Audit
        </button>
      </div>
    </article>
  )
})

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, CSSProperties> = {
  card: {
    width:        '100%',
    background:   'linear-gradient(135deg, #0058BE 0%, #003F8A 100%)',
    borderRadius: 'var(--radius-xl)',
    padding:       32,
    display:      'flex',
    flexDirection:'column',
    gap:            0,
    boxShadow:    '0 8px 32px rgba(0,63,138,0.45)',
  },
  badge: {
    display:      'inline-flex',
    alignSelf:    'flex-start',
    padding:      '4px 10px',
    border:       '1px solid rgba(255,255,255,0.4)',
    borderRadius:  99,
    fontSize:      10,
    fontFamily:   'var(--font-family)',
    fontWeight:    700,
    color:        '#FFFFFF',
    letterSpacing:'0.1em',
    textTransform:'uppercase',
    marginBottom:  16,
  },
  headline: {
    font:         'var(--font-heading-lg)',
    fontFamily:   'var(--font-family)',
    color:        '#FFFFFF',
    maxWidth:      460,
    lineHeight:    1.3,
    marginBottom:  12,
  },
  body: {
    fontSize:     14,
    fontFamily:  'var(--font-family)',
    color:       'rgba(255,255,255,0.78)',
    lineHeight:   1.55,
    maxWidth:     520,
    marginBottom: 24,
  },
  actions: {
    display:    'flex',
    alignItems: 'center',
    gap:         12,
  },
  btnPrimary: {
    padding:      '10px 20px',
    background:   '#FFFFFF',
    color:        '#0D1117',
    fontSize:      13,
    fontFamily:   'var(--font-family)',
    fontWeight:    600,
    border:       'none',
    borderRadius: 'var(--radius-md)',
    cursor:       'pointer',
    transition:   'opacity 0.12s ease, transform 0.12s ease',
  },
  btnGhost: {
    padding:      '10px 20px',
    background:   'transparent',
    color:        '#FFFFFF',
    fontSize:      13,
    fontFamily:   'var(--font-family)',
    fontWeight:    600,
    border:       '1px solid rgba(255,255,255,0.45)',
    borderRadius: 'var(--radius-md)',
    cursor:       'pointer',
    transition:   'background 0.12s ease',
  },
}
