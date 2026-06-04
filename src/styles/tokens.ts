/**
 * Design Tokens — Wealth Curator Dashboard
 * Premium fintech dark theme: dark navy + gold accent + white text
 *
 * Usage:
 *   import { tokens } from '@/styles/tokens'
 *   OR access via CSS variables: var(--color-bg-primary)
 */

// ─── Color Palette ────────────────────────────────────────────────────────────
export const colors = {
  // Backgrounds
  bgPrimary: '#0A0E1A',      // Deep navy — main background
  bgSecondary: '#0F1628',    // Slightly lighter navy — card bg
  bgTertiary: '#161D35',     // Elevated surface — modals, dropdowns
  bgOverlay: '#1E2740',      // Hover / active state overlays

  // Gold accent family
  gold: '#C9A84C',           // Primary gold accent
  goldLight: '#E8C87A',      // Light gold — highlights, hover
  goldDark: '#9B7A2E',       // Dark gold — pressed states
  goldMuted: 'rgba(201,168,76,0.15)', // Translucent gold — glass bg, rings

  // Text
  textPrimary: '#F0F2FF',    // Near-white — primary text
  textSecondary: '#8B94B2',  // Muted grey-blue — secondary text
  textMuted: '#4E5A78',      // Dimmed — placeholders, disabled
  textOnGold: '#0A0E1A',     // Dark navy on gold buttons

  // Semantic colors
  success: '#34D399',        // Emerald green
  successMuted: 'rgba(52,211,153,0.12)',
  error: '#F87171',          // Rose red
  errorMuted: 'rgba(248,113,113,0.12)',
  warning: '#FBBF24',        // Amber
  warningMuted: 'rgba(251,191,36,0.12)',
  info: '#60A5FA',           // Sky blue
  infoMuted: 'rgba(96,165,250,0.12)',

  // Borders & dividers
  border: 'rgba(139,148,178,0.12)',
  borderHover: 'rgba(201,168,76,0.35)',
  borderGold: 'rgba(201,168,76,0.5)',
} as const

// ─── Spacing Scale ─────────────────────────────────────────────────────────────
export const spacing = {
  xs:  '4px',
  sm:  '8px',
  md:  '12px',
  base:'16px',
  lg:  '24px',
  xl:  '32px',
  xxl: '48px',
} as const

// ─── Typography ────────────────────────────────────────────────────────────────
export const fontFamily = {
  sans:  "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif",
  mono:  "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  display: "'Inter', 'SF Pro Display', sans-serif",
} as const

export const fontSize = {
  xs:   '0.75rem',    // 12px
  sm:   '0.875rem',   // 14px
  base: '1rem',       // 16px
  lg:   '1.125rem',   // 18px
  xl:   '1.25rem',    // 20px
  '2xl':'1.5rem',     // 24px
  '3xl':'1.875rem',   // 30px
  '4xl':'2.25rem',    // 36px
  '5xl':'3rem',       // 48px
} as const

export const fontWeight = {
  regular:   '400',
  medium:    '500',
  semibold:  '600',
  bold:      '700',
  extrabold: '800',
} as const

export const lineHeight = {
  tight:  '1.2',
  snug:   '1.375',
  normal: '1.5',
  relaxed:'1.625',
} as const

export const letterSpacing = {
  tight:   '-0.02em',
  normal:  '0em',
  wide:    '0.05em',
  wider:   '0.1em',
  widest:  '0.15em',
} as const

// ─── Border Radius ─────────────────────────────────────────────────────────────
export const borderRadius = {
  none: '0px',
  sm:   '4px',
  md:   '8px',
  lg:   '12px',
  xl:   '16px',
  '2xl':'24px',
  full: '9999px',
} as const

// ─── Shadows ───────────────────────────────────────────────────────────────────
export const shadows = {
  sm:     '0 1px 2px rgba(0,0,0,0.4)',
  md:     '0 4px 12px rgba(0,0,0,0.5)',
  lg:     '0 8px 24px rgba(0,0,0,0.55)',
  xl:     '0 16px 48px rgba(0,0,0,0.6)',
  gold:   '0 0 20px rgba(201,168,76,0.25), 0 4px 12px rgba(0,0,0,0.4)',
  goldGlow: '0 0 40px rgba(201,168,76,0.35)',
  inner:  'inset 0 1px 3px rgba(0,0,0,0.5)',
  glass:  '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
} as const

// ─── Transitions ──────────────────────────────────────────────────────────────
export const transitions = {
  fast:   'all 0.1s ease',
  base:   'all 0.2s ease',
  slow:   'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const

// ─── Z-Index ───────────────────────────────────────────────────────────────────
export const zIndex = {
  base:    0,
  raised:  10,
  dropdown:100,
  sticky:  200,
  overlay: 300,
  modal:   400,
  toast:   500,
} as const

// ─── Breakpoints ───────────────────────────────────────────────────────────────
export const breakpoints = {
  sm:  '640px',
  md:  '768px',
  lg:  '1024px',
  xl:  '1280px',
  '2xl':'1536px',
} as const

// ─── Aggregate export ──────────────────────────────────────────────────────────
export const tokens = {
  colors,
  spacing,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
} as const

export type Tokens = typeof tokens
export default tokens
