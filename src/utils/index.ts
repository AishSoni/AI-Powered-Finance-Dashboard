// src/utils/.gitkeep
// Add pure utility functions here, e.g.:
// - formatCurrency.ts
// - formatPercent.ts
// - cn.ts (classnames helper)
// - dateUtils.ts

export { initGA, gtagEvent } from './analytics'
export { generateInsights } from './insightsEngine'
export type { ProStrategyInsight, InsightSeverity } from './insightsEngine'


/**
 * Format a number as USD currency string.
 * @example formatCurrency(4820000) → "$4,820,000.00"
 */
export function formatCurrency(value: number, locale = 'en-US', currency = 'USD'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value)
}

/**
 * Format a decimal as a percentage string.
 * @example formatPercent(0.087) → "+8.70%"
 */
export function formatPercent(value: number, showSign = true): string {
  const pct = (value * 100).toFixed(2)
  return showSign && value > 0 ? `+${pct}%` : `${pct}%`
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Lightweight classnames helper (no library dependency).
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
