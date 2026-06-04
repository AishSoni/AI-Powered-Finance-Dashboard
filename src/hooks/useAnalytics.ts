import { useCallback } from 'react'

// ─── Event Constants (object literal for tree-shaking) ────────────────────────

/**
 * Canonical analytics event names for Proton Finance.
 * Use these instead of raw strings to prevent typos and enable refactoring.
 */
export const ANALYTICS_EVENTS = {
  PAGE_VIEW:              'page_view',
  SEARCH_USED:            'search_used',
  FILTER_CLICKED:         'filter_clicked',
  STRATEGY_EXECUTED:      'strategy_executed',
  REVIEW_AUDIT_CLICKED:   'review_audit_clicked',
  ALERT_DISMISSED:        'alert_dismissed',
  TRANSACTION_FILTERED:   'transaction_filtered',
  THEME_TOGGLED:          'theme_toggled',
  BUDGET_LIMIT_ADJUSTED:  'budget_limit_adjusted',
  EXPORT_CSV_CLICKED:     'export_csv_clicked',
} as const

export type AnalyticsEventName = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS]

// ─── GA4 shim — gracefully absent when gtag is not loaded ─────────────────────

type GtagFn = (
  command: 'event',
  eventName: string,
  params?: Record<string, unknown>,
) => void

/** Returns `window.gtag` if available, otherwise a silent no-op. */
function getGtag(): GtagFn {
  if (typeof window !== 'undefined') {
    const w = window as unknown as { gtag?: GtagFn }
    if (typeof w.gtag === 'function') return w.gtag
  }
  return () => { /* no-op: gtag not loaded */ }
}

// ─── Hook return type ─────────────────────────────────────────────────────────

export interface UseAnalyticsResult {
  /**
   * Fire any GA4 event with arbitrary params.
   * @param eventName - One of `ANALYTICS_EVENTS` or any custom string
   * @param params    - Optional key-value map sent as GA4 event parameters
   */
  trackEvent: (eventName: string, params?: Record<string, unknown>) => void

  /**
   * Track a page view. Call on route changes.
   * @param pagePath  - e.g. `/dashboard` or `/portfolio`
   * @param pageTitle - Human-readable page title
   */
  trackPageView: (pagePath: string, pageTitle?: string) => void

  /**
   * Track a search query submission.
   * @param query     - The search term entered by the user
   * @param resultCount - Number of results returned (optional)
   */
  trackSearch: (query: string, resultCount?: number) => void

  /**
   * Track a CTA button click inside an AI insight card.
   * @param ctaLabel  - Label of the button (e.g. "Rebalance Now")
   * @param insightId - Unique ID of the insight card being actioned
   */
  trackCTAClick: (ctaLabel: string, insightId: string) => void

  /**
   * Track a filter chip or dropdown selection.
   * @param filterName  - Name of the filter (e.g. "category", "date_range")
   * @param filterValue - Selected value (e.g. "Technology", "last_30_days")
   */
  trackFilterClick: (filterName: string, filterValue: string) => void
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Provides analytics tracking functions scoped to Proton Finance events.
 * All functions silently no-op when GA4 (`window.gtag`) is not present,
 * making it safe to call in development or server-side contexts.
 *
 * @example
 * const { trackCTAClick, trackPageView } = useAnalytics()
 * trackPageView('/dashboard', 'Wealth Dashboard')
 * trackCTAClick('Rebalance Now', 'insight-001')
 */
export function useAnalytics(): UseAnalyticsResult {
  const trackEvent = useCallback((
    eventName: string,
    params?: Record<string, unknown>,
  ) => {
    getGtag()('event', eventName, params)
  }, [])

  const trackPageView = useCallback((pagePath: string, pageTitle?: string) => {
    trackEvent(ANALYTICS_EVENTS.PAGE_VIEW, {
      page_path:  pagePath,
      page_title: pageTitle ?? document.title,
    })
  }, [trackEvent])

  const trackSearch = useCallback((query: string, resultCount?: number) => {
    trackEvent(ANALYTICS_EVENTS.SEARCH_USED, {
      search_term:   query,
      result_count:  resultCount,
    })
  }, [trackEvent])

  const trackCTAClick = useCallback((ctaLabel: string, insightId: string) => {
    trackEvent(ANALYTICS_EVENTS.STRATEGY_EXECUTED, {
      cta_label:  ctaLabel,
      insight_id: insightId,
    })
  }, [trackEvent])

  const trackFilterClick = useCallback((filterName: string, filterValue: string) => {
    trackEvent(ANALYTICS_EVENTS.FILTER_CLICKED, {
      filter_name:  filterName,
      filter_value: filterValue,
    })
  }, [trackEvent])

  return { trackEvent, trackPageView, trackSearch, trackCTAClick, trackFilterClick }
}
