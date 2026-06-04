/**
 * tokens.ts — Proton Finance · Design Tokens (TypeScript mirror of tokens.css)
 * Use these in JS/TS logic (e.g., chart color arrays, dynamic style objects).
 * CSS custom properties in tokens.css are the authoritative source for components.
 */

// ─── Color Palette ────────────────────────────────────────────────────────────
export const colors = {
  dark: {
    bgBase:     '#0D1117',
    bgSurface:  '#161B27',
    bgSidebar:  '#0B0F1A',
    bgElevated: '#1E2435',
    bgInput:    '#1A2030',
    border:     '#1E2A3A',
    borderSubtle: '#151D2B',
  },
  light: {
    bgBase:     '#F4F6FA',
    bgSurface:  '#FFFFFF',
    bgSidebar:  '#1A1D2E',    // sidebar stays dark
    bgElevated: '#EEF1F8',
    bgInput:    '#F0F2F7',
    border:     '#E2E6EF',
    borderSubtle: '#EDF0F7',
  },
  // Shared across themes
  primary:       '#0058BE',
  primaryHover:  '#0066D9',
  success:       '#00A86B',
  warning:       '#924700',
  warningLight:  '#F5A623',
  error:         '#D93025',

  // Chart / data visualization palette
  chart: ['#0058BE', '#00A86B', '#F5A623', '#D93025', '#8B5CF6', '#06B6D4'],
} as const

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const spacing = {
  1:  4,
  2:  8,
  3:  12,
  4:  16,
  5:  20,
  6:  24,
  8:  32,
  10: 40,
  12: 48,
  16: 64,
} as const

// ─── Typography ────────────────────────────────────────────────────────────────
export const fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

export const fontSize = {
  displayLg: '2.75rem',   // 44px — large financial numbers
  displayMd: '2rem',      // 32px
  displaySm: '1.5rem',    // 24px
  headingLg: '1.25rem',   // 20px
  headingMd: '1rem',      // 16px
  headingSm: '0.875rem',  // 14px
  bodyMd:    '0.875rem',  // 14px
  bodySm:    '0.8125rem', // 13px
  labelMd:   '0.75rem',   // 12px
  labelSm:   '0.6875rem', // 11px
} as const

// ─── Border Radius ─────────────────────────────────────────────────────────────
export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
} as const

// ─── Shadows ───────────────────────────────────────────────────────────────────
export const shadows = {
  card:     '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
  elevated: '0 4px 16px rgba(0,0,0,0.4)',
  sidebar:  '4px 0 24px rgba(0,0,0,0.5)',
} as const

// ─── Layout ────────────────────────────────────────────────────────────────────
export const layout = {
  sidebarWidth:    240,
  headerHeight:    64,
  contentMaxWidth: 1440,
} as const

// ─── Aggregate ────────────────────────────────────────────────────────────────
export const tokens = { colors, spacing, fontFamily, fontSize, borderRadius, shadows, layout } as const
export type Tokens = typeof tokens
export default tokens
