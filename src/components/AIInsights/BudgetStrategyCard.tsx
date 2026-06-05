import { memo, useCallback, type CSSProperties } from 'react'
import { useAnalytics, ANALYTICS_EVENTS } from '@/hooks'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BudgetStrategyCardProps {
  insightId:    string
  headline:     string
  highlight:    string
  highlightSuffix?: string
  badgeLabel?:  string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const BudgetStrategyCard = memo(function BudgetStrategyCard({
  insightId,
  headline,
  highlight,
  highlightSuffix,
  badgeLabel = 'BUDGET STRATEGY',
}: BudgetStrategyCardProps) {
  const { trackEvent } = useAnalytics()

  const handleApply = useCallback(() => {
    trackEvent(ANALYTICS_EVENTS.STRATEGY_EXECUTED, {
      cta_label:  'Apply Strategy',
      insight_id: insightId,
      type:       'budget',
    })
  }, [insightId, trackEvent])

  return (
    <article style={s.card} aria-label="Budget Strategy Insight">

      {/* Badge */}
      <div style={s.badge}>{badgeLabel}</div>

      {/* Headline with highlighted value */}
      <p style={s.headline}>
        {headline}{' '}
        <span style={s.highlight}>{highlight}</span>
        {highlightSuffix && <span>{` ${highlightSuffix}`}</span>}
      </p>

      {/* CTA */}
      <button
        id={`apply-budget-strategy-${insightId}`}
        style={s.btn}
        onClick={handleApply}
        aria-label="Apply this budget strategy"
      >
        Apply Strategy
      </button>
    </article>
  )
})

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, CSSProperties> = {
  card: {
    width:        280,
    background:   'linear-gradient(135deg, #0058BE 0%, #003F8A 100%)',
    borderRadius: 'var(--radius-xl)',
    padding:       20,
    display:      'flex',
    flexDirection:'column',
    gap:           12,
    boxShadow:    '0 6px 24px rgba(0,63,138,0.4)',
    flexShrink:    0,
  },
  badge: {
    display:      'inline-flex',
    alignSelf:    'flex-start',
    padding:      '3px 8px',
    border:       '1px solid rgba(255,255,255,0.35)',
    borderRadius:  99,
    fontSize:      9,
    fontFamily:   'var(--font-family)',
    fontWeight:    700,
    color:        '#FFFFFF',
    letterSpacing:'0.1em',
    textTransform:'uppercase',
  },
  headline: {
    fontSize:    13,
    fontFamily: 'var(--font-family)',
    fontWeight:  400,
    color:      'rgba(255,255,255,0.85)',
    lineHeight:  1.45,
    margin:       0,
  },
  highlight: {
    fontSize:     18,
    fontWeight:   700,
    color:       '#FFFFFF',
    letterSpacing:'-0.02em',
  },
  btn: {
    padding:      '8px 14px',
    background:   '#FFFFFF',
    color:        '#0D1117',
    fontSize:      12,
    fontFamily:   'var(--font-family)',
    fontWeight:    600,
    border:       'none',
    borderRadius: 'var(--radius-md)',
    cursor:       'pointer',
    alignSelf:    'flex-start',
    transition:   'opacity 0.12s ease',
  },
}
