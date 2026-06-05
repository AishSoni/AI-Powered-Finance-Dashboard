import { useCallback } from 'react'
import { gtagEvent } from '@/utils/analytics'

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

export interface UseAnalyticsResult {
  trackEvent: (eventName: string, params?: Record<string, unknown>) => void
  trackPageView: (pagePath: string, pageTitle?: string) => void
  trackSearch: (query: string, resultCount?: number) => void
  trackCTAClick: (ctaLabel: string, insightId: string) => void
  trackFilterClick: (category: string, page: string) => void
}

export function useAnalytics(): UseAnalyticsResult {
  const trackEvent = useCallback((eventName: string, params?: Record<string, unknown>) => {
    gtagEvent(eventName, params ?? {})
  }, [])

  const trackPageView = useCallback((pagePath: string, pageTitle?: string) => {
    trackEvent(ANALYTICS_EVENTS.PAGE_VIEW, {
      page_path: pagePath,
      page_title: pageTitle ?? document.title,
    })
  }, [trackEvent])

  const trackSearch = useCallback((query: string, resultCount?: number) => {
    trackEvent(ANALYTICS_EVENTS.SEARCH_USED, {
      search_term: query,
      result_count: resultCount,
    })
  }, [trackEvent])

  const trackCTAClick = useCallback((ctaLabel: string, insightId: string) => {
    trackEvent(ANALYTICS_EVENTS.STRATEGY_EXECUTED, {
      cta_label: ctaLabel,
      insight_id: insightId,
    })
  }, [trackEvent])

  const trackFilterClick = useCallback((category: string, page: string) => {
    trackEvent(ANALYTICS_EVENTS.FILTER_CLICKED, {
      category,
      page,
    })
  }, [trackEvent])

  return { trackEvent, trackPageView, trackSearch, trackCTAClick, trackFilterClick }
}
