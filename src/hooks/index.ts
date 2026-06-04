/**
 * Proton Finance — Custom Hooks
 * ─────────────────────────────
 * Barrel re-export. Import from '@/hooks' instead of individual files.
 *
 * @example
 * import { useFetch, useDebounce, useLocalStorage, useAnalytics, ANALYTICS_EVENTS } from '@/hooks'
 */

export { useFetch }                               from './useFetch'
export type { UseFetchResult }                    from './useFetch'

export { useAnalytics, ANALYTICS_EVENTS }         from './useAnalytics'
export type { UseAnalyticsResult, AnalyticsEventName } from './useAnalytics'

export { useDebounce, useDebouncedCallback }      from './useDebounce'

export { useLocalStorage }                        from './useLocalStorage'
export type { SetValue }                          from './useLocalStorage'
