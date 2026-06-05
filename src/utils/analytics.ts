/**
 * analytics.ts — Proton Finance
 * ─────────────────────────────────────────────────────────────────────────────
 * Thin wrapper around the GA4 gtag.js global.
 *
 * Ad-blocker / SSR safety:
 *   All exports check `typeof window.gtag === 'function'` before dispatching.
 *   If the GA script is blocked or the env var is absent, events silently
 *   no-op — no errors, no console noise.
 *
 * Never import `gtag` directly in components. Use `useAnalytics()` instead.
 */

// ─── Type declarations ────────────────────────────────────────────────────────

type GtagParams = Record<string, unknown>

type GtagFn = {
  (command: 'js', date: Date): void
  (command: 'config', measurementId: string, params?: GtagParams): void
  (command: 'event', eventName: string, params?: GtagParams): void
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: GtagFn
  }
}

// ─── Guard ────────────────────────────────────────────────────────────────────

/**
 * Returns the real `window.gtag` if the GA script has loaded successfully,
 * or `null` if it hasn't (SSR, ad-blocker, missing env var).
 *
 * Intentionally does NOT polyfill a fallback — we want a clean no-op rather
 * than silently queuing events that will never be sent.
 */
function getGtag(): GtagFn | null {
  if (typeof window === 'undefined') return null
  if (typeof window.gtag !== 'function') return null
  return window.gtag
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Initialise GA4 with the given Measurement ID.
 * Called once from `main.tsx` (or skipped when the env var is absent).
 */
export function initGA(measurementId: string): void {
  const gtag = getGtag()
  if (!gtag || !measurementId) return

  gtag('js', new Date())
  gtag('config', measurementId, {
    page_title: 'Proton Finance Dashboard',
  })
}

/**
 * Fire a GA4 event. Silent no-op when gtag is unavailable.
 *
 * @param name   - GA4 event name (use ANALYTICS_EVENTS constants)
 * @param params - Event parameters (merged with GA4 global params automatically)
 */
export function gtagEvent(name: string, params: GtagParams = {}): void {
  const gtag = getGtag()
  if (!gtag) return

  gtag('event', name, params)
}
