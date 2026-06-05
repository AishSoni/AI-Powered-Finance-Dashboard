/**
 * useAnalytics.ts — Proton Finance
 * ─────────────────────────────────────────────────────────────────────────────
 * GA4 event wrapper hook. All component analytics calls go through here —
 * never raw `gtag()` calls in component files.
 *
 * Event dispatch is guarded in gtagEvent (src/utils/analytics.ts):
 * if window.gtag is absent (ad-blocker, SSR, missing VITE_GA_MEASUREMENT_ID)
 * all calls silently no-op.
 */

import { useCallback } from 'react'
import { gtagEvent } from '@/utils/analytics'

// ─── Event name constants ─────────────────────────────────────────────────────

export const ANALYTICS_EVENTS = {
  PAGE_VIEW:             'page_view',
  SEARCH_USED:           'search_used',
  FILTER_CLICKED:        'filter_clicked',
  STRATEGY_EXECUTED:     'strategy_executed',
  REVIEW_AUDIT_CLICKED:  'review_audit_clicked',
  ALERT_DISMISSED:       'alert_dismissed',
  TRANSACTION_FILTERED:  'transaction_filtered',
  THEME_TOGGLED:         'theme_toggled',
  BUDGET_LIMIT_ADJUSTED: 'budget_limit_adjusted',
  EXPORT_CSV_CLICKED:    'export_csv_clicked',
} as const

export type AnalyticsEventName = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS]

// ─── Return type ──────────────────────────────────────────────────────────────

export interface UseAnalyticsResult {
  /** Low-level escape hatch — prefer the typed helpers below */
  trackEvent:        (eventName: string, params?: Record<string, unknown>) => void
  /** page_view · { page_path, page_title } */
  trackPageView:     (pagePath: string, pageTitle?: string) => void
  /** search_used · { query } — call debounced, not on every keystroke */
  trackSearch:       (query: string) => void
  /** strategy_executed · { cta_label, insight_id, insight_type } */
  trackCTAClick:     (ctaLabel: string, insightId: string, insightType?: string) => void
  /** filter_clicked · { category, page } */
  trackFilterClick:  (category: string, page: string) => void
  /** alert_dismissed · { alert_id, severity } */
  trackAlertDismiss: (alertId: string, severity: string) => void
  /** export_csv_clicked · { row_count } */
  trackCSVExport:    (rowCount: number) => void
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAnalytics(): UseAnalyticsResult {
  // ── Base dispatcher ──────────────────────────────────────────────────────
  const trackEvent = useCallback((eventName: string, params?: Record<string, unknown>) => {
    gtagEvent(eventName, params ?? {})
  }, [])

  // ── Typed helpers ────────────────────────────────────────────────────────

  /** App loads or page navigation — page_view */
  const trackPageView = useCallback((pagePath: string, pageTitle?: string) => {
    trackEvent(ANALYTICS_EVENTS.PAGE_VIEW, {
      page_path:  pagePath,
      page_title: pageTitle ?? document.title,
    })
  }, [trackEvent])

  /** Debounced search input — search_used · { query } */
  const trackSearch = useCallback((query: string) => {
    trackEvent(ANALYTICS_EVENTS.SEARCH_USED, { query })
  }, [trackEvent])

  /** "Execute Strategy" CTA — strategy_executed · { cta_label, insight_id, insight_type } */
  const trackCTAClick = useCallback((
    ctaLabel: string,
    insightId: string,
    insightType = 'strategy',
  ) => {
    trackEvent(ANALYTICS_EVENTS.STRATEGY_EXECUTED, {
      cta_label:    ctaLabel,
      insight_id:   insightId,
      insight_type: insightType,
    })
  }, [trackEvent])

  /** Category filter pill — filter_clicked · { category, page } */
  const trackFilterClick = useCallback((category: string, page: string) => {
    trackEvent(ANALYTICS_EVENTS.FILTER_CLICKED, { category, page })
  }, [trackEvent])

  /** Alert X button — alert_dismissed · { alert_id, severity } */
  const trackAlertDismiss = useCallback((alertId: string, severity: string) => {
    trackEvent(ANALYTICS_EVENTS.ALERT_DISMISSED, {
      alert_id: alertId,
      severity,
    })
  }, [trackEvent])

  /** Export CSV button — export_csv_clicked · { row_count } */
  const trackCSVExport = useCallback((rowCount: number) => {
    trackEvent(ANALYTICS_EVENTS.EXPORT_CSV_CLICKED, { row_count: rowCount })
  }, [trackEvent])

  return {
    trackEvent,
    trackPageView,
    trackSearch,
    trackCTAClick,
    trackFilterClick,
    trackAlertDismiss,
    trackCSVExport,
  }
}
