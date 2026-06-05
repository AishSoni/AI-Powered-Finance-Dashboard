type GtagCommand = 'config' | 'event' | 'js'
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

function ensureGtag(): GtagFn | null {
  if (typeof window === 'undefined') return null

  window.dataLayer = window.dataLayer || []

  if (typeof window.gtag !== 'function') {
    window.gtag = ((command: GtagCommand, ...args: unknown[]) => {
      window.dataLayer?.push([command, ...args])
    }) as GtagFn
  }

  return window.gtag
}

export function initGA(measurementId: string): void {
  const gtag = ensureGtag()
  if (!gtag) return

  gtag('js', new Date())
  gtag('config', measurementId, {
    page_title: 'Proton Finance Dashboard',
  })
}

export function gtagEvent(name: string, params: object = {}): void {
  const gtag = ensureGtag()
  if (!gtag) return

  gtag('event', name, params as GtagParams)
}
