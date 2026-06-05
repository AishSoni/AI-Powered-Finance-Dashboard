import { memo, useCallback, type CSSProperties } from 'react'
import { AlertTriangle, Info, TrendingDown, X } from 'lucide-react'
import { useAnalytics, ANALYTICS_EVENTS } from '@/hooks'

// ─── Types ────────────────────────────────────────────────────────────────────

export type AlertSeverity = 'warning' | 'error' | 'info'

export interface Alert {
  id:       string
  severity: AlertSeverity
  title:    string
  body:     string
  time:     string
}

// ─── Alert icon map ───────────────────────────────────────────────────────────

const ICON_MAP: Record<AlertSeverity, { Icon: typeof AlertTriangle; color: string; bg: string }> = {
  warning: { Icon: AlertTriangle, color: 'var(--color-warning-light)', bg: 'rgba(245,166,35,0.12)' },
  error:   { Icon: TrendingDown,  color: 'var(--color-error)',         bg: 'var(--color-error-muted)' },
  info:    { Icon: Info,          color: 'var(--color-primary)',        bg: 'var(--color-primary-muted)' },
}

// ─── Single alert item ────────────────────────────────────────────────────────

interface AlertItemProps {
  alert:   Alert
  compact: boolean
}

const AlertItem = memo(function AlertItem({ alert, compact }: AlertItemProps) {
  const { trackEvent } = useAnalytics()
  const { Icon, color, bg } = ICON_MAP[alert.severity]

  const handleDismiss = useCallback(() => {
    trackEvent(ANALYTICS_EVENTS.ALERT_DISMISSED, {
      severity: alert.severity,
      id: alert.id,
    })
  }, [alert.id, alert.severity, trackEvent])

  return (
    <div style={s.item}>
      {/* Icon badge */}
      <div style={{ ...s.iconWrap, background: bg }} aria-hidden="true">
        <Icon size={14} color={color} strokeWidth={2} />
      </div>

      {/* Content */}
      <div style={s.content}>
        <div style={s.itemTitle}>{alert.title}</div>
        {!compact && <div style={s.itemBody}>{alert.body}</div>}
        <div style={s.itemTime}>{alert.time}</div>
      </div>

      {/* Dismiss (full variant only) */}
      {!compact && (
        <button style={s.dismiss} onClick={handleDismiss} aria-label={`Dismiss alert: ${alert.title}`}>
          <X size={13} strokeWidth={2} />
        </button>
      )}
    </div>
  )
})

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function AlertSkeleton() {
  return (
    <div style={{ ...s.item, pointerEvents: 'none' }} aria-hidden="true">
      <div style={{ ...sk.icon }} />
      <div style={s.content}>
        <div style={sk.title} />
        <div style={sk.body} />
      </div>
    </div>
  )
}

// ─── ActiveAlertsPreview ──────────────────────────────────────────────────────

interface ActiveAlertsPreviewProps {
  alerts?:  Alert[]
  loading?: boolean
  compact?: boolean
}

export const ActiveAlertsPreview = memo(function ActiveAlertsPreview({
  alerts,
  loading = false,
  compact = true,
}: ActiveAlertsPreviewProps) {
  return (
    <section style={s.panel} aria-live="polite" aria-label="Active financial alerts">

      {/* Header */}
      <div style={s.header}>
        <span style={s.headerTitle}>Active Alerts</span>
        {alerts && alerts.length > 0 && (
          <span style={s.count}>{alerts.length}</span>
        )}
      </div>

      <div style={s.list}>
        {/* Loading skeletons */}
        {loading && (
          <div role="status" aria-label="Loading financial data">
            {[0, 1, 2].map((i) => <AlertSkeleton key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && (!alerts || alerts.length === 0) && (
          <div style={s.empty}>
            <Info size={18} color="var(--color-text-tertiary)" />
            <span>No active alerts</span>
          </div>
        )}

        {/* Alert items */}
        {!loading && alerts?.map((alert) => (
          <AlertItem key={alert.id} alert={alert} compact={compact} />
        ))}
      </div>
    </section>
  )
})

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, CSSProperties> = {
  panel: {
    background:   'var(--color-bg-surface)',
    border:       '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    overflow:     'hidden',
  },
  header: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    padding:        '14px 16px 12px',
    borderBottom:   '1px solid var(--color-border-subtle)',
  },
  headerTitle: {
    fontSize:   14,
    fontFamily: 'var(--font-family)',
    fontWeight:  700,
    color:      'var(--color-text-primary)',
  },
  count: {
    minWidth:       18,
    height:          18,
    borderRadius:    99,
    background:     'var(--color-error)',
    color:          '#fff',
    fontSize:        10,
    fontFamily:     'var(--font-family)',
    fontWeight:      700,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    padding:        '0 5px',
  },
  list: {
    display:       'flex',
    flexDirection: 'column',
    gap:            0,
  },
  item: {
    display:    'flex',
    alignItems: 'flex-start',
    gap:         10,
    padding:    '12px 16px',
    borderBottom:'1px solid var(--color-border-subtle)',
    transition: 'background 0.12s ease',
  },
  iconWrap: {
    width:          28,
    height:          28,
    borderRadius:    8,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:      0,
    marginTop:       1,
  },
  content: {
    flex:          1,
    minWidth:       0,
    display:       'flex',
    flexDirection: 'column',
    gap:            3,
  },
  itemTitle: {
    fontSize:   12,
    fontFamily: 'var(--font-family)',
    fontWeight:  600,
    color:      'var(--color-text-primary)',
    lineHeight:  1.3,
  },
  itemBody: {
    fontSize:   11,
    fontFamily: 'var(--font-family)',
    color:      'var(--color-text-secondary)',
    lineHeight:  1.4,
  },
  itemTime: {
    fontSize:   10,
    fontFamily: 'var(--font-family)',
    color:      'var(--color-text-tertiary)',
    marginTop:   2,
  },
  dismiss: {
    color:      'var(--color-text-tertiary)',
    cursor:     'pointer',
    border:     'none',
    background: 'none',
    padding:     4,
    flexShrink:  0,
    display:    'flex',
    borderRadius: 6,
    transition: 'color 0.12s ease, background 0.12s ease',
    marginTop:   1,
  },
  empty: {
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    justifyContent: 'center',
    gap:             8,
    padding:        '28px 16px',
    fontSize:        12,
    fontFamily:     'var(--font-family)',
    color:          'var(--color-text-tertiary)',
  },
}

// Shimmer
const SHIMMER: CSSProperties = {
  background:     'linear-gradient(90deg, var(--color-bg-elevated) 25%, var(--color-bg-input) 50%, var(--color-bg-elevated) 75%)',
  backgroundSize: '200% 100%',
  animation:      'shimmer 1.4s ease infinite',
  borderRadius:    6,
}

const sk: Record<string, CSSProperties> = {
  icon:  { ...SHIMMER, width: 28, height: 28, borderRadius: 8, flexShrink: 0 },
  title: { ...SHIMMER, height: 12, width: '70%' },
  body:  { ...SHIMMER, height: 10, width: '90%', marginTop: 5 },
}

export type { AlertItemProps }
