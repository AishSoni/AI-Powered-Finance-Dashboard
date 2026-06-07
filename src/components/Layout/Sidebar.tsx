import type { CSSProperties, FC } from 'react'
import React from 'react'
import { memo, useCallback, useState } from 'react'
import {
  LayoutDashboard, Building2, ArrowLeftRight,
  Wallet, Sparkles, HelpCircle, LogOut,
  Sun, Moon, Zap, Lock, LockOpen,
  ChevronRight,
} from 'lucide-react'
import { useTheme } from '@/context/theme'
import { useAnalytics, ANALYTICS_EVENTS } from '@/hooks'

// ─── Nav definition ───────────────────────────────────────────────────────────

interface NavItem {
  id: string
  label: string
  Icon: React.FC<{ size?: number; strokeWidth?: number }>
  badge?: number
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard',    label: 'Dashboard',    Icon: LayoutDashboard },
  { id: 'accounts',     label: 'Accounts',     Icon: Building2 },
  { id: 'transactions', label: 'Transactions', Icon: ArrowLeftRight },
  { id: 'budgets',      label: 'Budgets',      Icon: Wallet },
  { id: 'insights',     label: 'Insights',     Icon: Sparkles, badge: 3 },
]

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SidebarProps {
  activePage: string
  onNavigate: (page: string) => void
  isExpanded: boolean
  isLocked: boolean
  onHoverExpand: () => void
  onHoverCollapse: () => void
  onLockToggle: () => void
  /** Extra CSS class stamped on <aside> — used for media-query targeting */
  asideClassName?: string
  /** CSS transform applied directly to <aside> — used for mobile slide-in/out */
  asideTransform?: string
  /** z-index override — mobile drawer needs higher z than desktop */
  asideZIndex?: number
}

interface NavItemButtonProps extends NavItem {
  isActive: boolean
  isExpanded: boolean
  onNavigate: (page: string) => void
}

const NavItemButton = memo(function NavItemButton({
  id,
  label,
  Icon,
  badge,
  isActive,
  isExpanded,
  onNavigate,
}: NavItemButtonProps) {
  const handleClick = useCallback(() => {
    onNavigate(id)
  }, [id, onNavigate])

  return (
    <button
      id={`nav-${id}`}
      style={isActive ? { ...s.navItem, ...s.navItemActive } : s.navItem}
      onClick={handleClick}
      aria-current={isActive ? 'page' : undefined}
      aria-label={label}
      title={!isExpanded ? label : undefined}
    >
      <span style={isActive ? { ...s.navIcon, ...s.navIconActive } : s.navIcon} aria-hidden="true">
        <Icon size={16} strokeWidth={1.75} />
      </span>
      <span style={{ ...s.navLabel, ...(!isExpanded ? s.labelHidden : {}) }}>{label}</span>
      {badge != null && isExpanded && (
        <span style={s.navBadge} aria-label={`${badge} unread`}>{badge}</span>
      )}
      {badge != null && !isExpanded && (
        <span style={s.badgeDot} aria-hidden="true" />
      )}
    </button>
  )
})

// ─── Component ────────────────────────────────────────────────────────────────

const Sidebar: FC<SidebarProps> = ({
  activePage,
  onNavigate,
  isExpanded,
  isLocked,
  onHoverExpand,
  onHoverCollapse,
  onLockToggle,
  asideClassName,
  asideTransform,
  asideZIndex,
}) => {
  const { isDark, toggleTheme } = useTheme()
  const { trackEvent } = useAnalytics()

  const handleThemeToggle = useCallback(() => {
    const newTheme = isDark ? 'light' : 'dark'
    toggleTheme()
    trackEvent(ANALYTICS_EVENTS.THEME_TOGGLED, { newTheme })
  }, [isDark, toggleTheme, trackEvent])

  const sidebarStyle: CSSProperties = {
    ...s.sidebar,
    width:     isExpanded ? 240 : 60,
    transform: asideTransform,
    zIndex:    asideZIndex ?? (s.sidebar.zIndex as number),
    // Add transition for transform on mobile slide
    transition: asideTransform !== undefined
      ? 'width 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1)'
      : 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  }

  return (
    <aside
      className={asideClassName}
      style={sidebarStyle}
      aria-label="Application sidebar"
      aria-expanded={isExpanded}
      onMouseEnter={onHoverExpand}
      onMouseLeave={onHoverCollapse}
    >
      {/* ── Logo ── */}
      <div style={s.logoRow}>
        <div style={s.logoIcon} aria-hidden="true">
          <Zap size={16} color="#0058BE" strokeWidth={2.5} />
        </div>
        <div style={{ ...s.logoTextWrap, ...(!isExpanded ? s.labelHidden : {}) }}>
          <div style={s.logoName}>Proton Finance</div>
          <div style={s.logoSub}>WEALTH CURATOR</div>
        </div>
      </div>

      <div style={s.divider} role="separator" />

      {/* ── Nav ── */}
      <nav aria-label="Main navigation" style={s.nav}>
        {NAV_ITEMS.map((item) => (
          <NavItemButton
            key={item.id}
            {...item}
            isActive={activePage === item.id}
            isExpanded={isExpanded}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {/* ── Spacer ── */}
      <div style={{ flex: 1 }} />

      {/* ── Pro Access card ── */}
      {isExpanded && (
        <div style={s.proCard}>
          <div style={s.proCardInner}>
            <Sparkles size={14} color="#fff" strokeWidth={2} style={{ marginBottom: 6 }} aria-hidden="true" />
            <div style={s.proTitle}>PRO ACCESS</div>
            <div style={s.proBody}>Unlock AI Strategy Insights</div>
            <button style={s.proBtn} aria-label="Upgrade to Proton Finance Premium">
              Upgrade to Premium
            </button>
          </div>
        </div>
      )}

      {/* ── Bottom links ── */}
      <div style={s.bottomLinks}>
        <button style={s.bottomLink} aria-label="Help Center" title={!isExpanded ? 'Help Center' : undefined}>
          <HelpCircle size={15} strokeWidth={1.75} aria-hidden="true" />
          <span style={{ ...s.navLabel, ...(!isExpanded ? s.labelHidden : {}) }}>Help Center</span>
        </button>
        <button style={s.bottomLink} aria-label="Log out" title={!isExpanded ? 'Logout' : undefined}>
          <LogOut size={15} strokeWidth={1.75} aria-hidden="true" />
          <span style={{ ...s.navLabel, ...(!isExpanded ? s.labelHidden : {}) }}>Logout</span>
        </button>
      </div>

      <div style={s.divider} role="separator" />

      {/* ── Theme toggle ── */}
      <button
        id="theme-toggle"
        style={s.themeToggle}
        onClick={handleThemeToggle}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={!isExpanded ? (isDark ? 'Light Mode' : 'Dark Mode') : undefined}
      >
        {isDark
          ? <Sun size={15} strokeWidth={1.75} aria-hidden="true" />
          : <Moon size={15} strokeWidth={1.75} aria-hidden="true" />}
        <span style={{ ...s.navLabel, ...(!isExpanded ? s.labelHidden : {}) }}>
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      </button>

      {/* ── Lock toggle ── */}
      <button
        id="sidebar-lock-toggle"
        style={s.themeToggle}
        onClick={onLockToggle}
        aria-label={isLocked ? 'Unlock sidebar' : 'Lock sidebar open'}
        title={!isExpanded ? (isLocked ? 'Unlock sidebar' : 'Lock open') : undefined}
      >
        {isLocked
          ? <Lock size={15} strokeWidth={1.75} color="#0058BE" aria-hidden="true" />
          : <LockOpen size={15} strokeWidth={1.75} aria-hidden="true" />}
        <span style={{ ...s.navLabel, ...(!isExpanded ? s.labelHidden : {}) }}>
          {isLocked ? 'Locked Open' : 'Lock Sidebar'}
        </span>
      </button>

      {/* ── Collapse chevron hint (only when locked & expanded) ── */}
      {isLocked && isExpanded && (
        <div style={s.lockIndicator}>
          <ChevronRight size={10} style={{ transform: 'rotate(180deg)' }} />
          <span style={s.lockLabel}>Locked</span>
        </div>
      )}

      {/* ── Footer ── */}
      {isExpanded && (
        <p style={s.footer}>
          © 2026 Editorial Finance. All financial data is encrypted and secure.
        </p>
      )}
    </aside>
  )
}

export default Sidebar

// ─── Styles ──────────────────────────────────────────────────────────────────
// Sidebar is ALWAYS dark — hardcoded colours, never inherit theme vars

const SIDEBAR_BG    = '#0B0F1A'
const SIDEBAR_BORDER = '#151D2B'
const TEXT_PRIMARY  = '#FFFFFF'
const TEXT_SECONDARY = '#8B92A5'
const TEXT_TERTIARY = '#555E72'

const s: Record<string, CSSProperties> = {
  sidebar: {
    position:        'fixed',
    top:             0,
    left:            0,
    height:          '100vh',
    background:      SIDEBAR_BG,
    borderRight:     `1px solid ${SIDEBAR_BORDER}`,
    boxShadow:       '4px 0 24px rgba(0,0,0,0.5)',
    display:         'flex',
    flexDirection:   'column',
    padding:         '20px 8px 16px',
    zIndex:          100,
    overflowY:       'auto',
    overflowX:       'hidden',
    boxSizing:       'border-box',
    transition:      'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange:      'width',
  },

  // Logo
  logoRow: {
    display:        'flex',
    alignItems:     'center',
    gap:            10,
    padding:        '4px 4px 16px',
    overflow:       'hidden',
  },
  logoIcon: {
    width:          32,
    height:         32,
    borderRadius:   8,
    background:     'rgba(0,88,190,0.15)',
    border:         '1px solid rgba(0,88,190,0.3)',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
  },
  logoTextWrap: {
    overflow:   'hidden',
    transition: 'opacity 0.2s ease, width 0.25s ease',
  },
  logoName: {
    fontSize:       14,
    fontFamily:     'var(--font-family)',
    fontWeight:     700,
    color:          TEXT_PRIMARY,
    lineHeight:     1.2,
    letterSpacing:  '-0.01em',
    whiteSpace:     'nowrap',
  },
  logoSub: {
    fontSize:       9,
    fontFamily:     'var(--font-family)',
    fontWeight:     600,
    color:          '#F5A623',
    letterSpacing:  '0.12em',
    textTransform:  'uppercase',
    marginTop:      1,
    whiteSpace:     'nowrap',
  },

  divider: {
    height:     1,
    background: SIDEBAR_BORDER,
    margin:     '8px 0',
    flexShrink: 0,
  },

  // Nav
  nav: {
    display:       'flex',
    flexDirection: 'column',
    gap:           2,
    marginTop:     4,
  },
  navItem: {
    display:        'flex',
    alignItems:     'center',
    gap:            12,
    height:         40,
    padding:        '0 12px',
    borderRadius:   8,
    border:         'none',
    borderLeft:     '3px solid transparent',
    background:     'transparent',
    color:          TEXT_SECONDARY,
    cursor:         'pointer',
    width:          '100%',
    textAlign:      'left',
    transition:     'background 0.12s ease, color 0.12s ease',
    boxSizing:      'border-box',
    flexShrink:     0,
    overflow:       'hidden',
    whiteSpace:     'nowrap',
    position:       'relative',
  },
  navItemActive: {
    background:   'rgba(0,88,190,0.12)',
    borderLeft:   '3px solid #0058BE',
    color:        TEXT_PRIMARY,
    borderRadius: '0 8px 8px 0',
  },
  navIcon: {
    color:    TEXT_TERTIARY,
    display:  'flex',
    flexShrink: 0,
  },
  navIconActive: {
    color: '#0058BE',
  },
  navLabel: {
    fontSize:     13,
    fontFamily:   'var(--font-family)',
    fontWeight:   500,
    flex:         1,
    overflow:     'hidden',
    whiteSpace:   'nowrap',
    transition:   'opacity 0.2s ease, max-width 0.25s ease',
    opacity:      1,
    maxWidth:     200,
  },
  labelHidden: {
    opacity:  0,
    maxWidth: 0,
  },
  navBadge: {
    minWidth:       18,
    height:         18,
    borderRadius:   99,
    background:     '#D93025',
    color:          '#fff',
    fontSize:       10,
    fontWeight:     700,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    padding:        '0 5px',
    flexShrink:     0,
  },
  badgeDot: {
    position:     'absolute',
    top:          6,
    right:        6,
    width:        7,
    height:       7,
    borderRadius: '50%',
    background:   '#D93025',
    border:       '1.5px solid #0B0F1A',
    flexShrink:   0,
  },

  // Pro card
  proCard: {
    margin:   '8px 0 4px',
    overflow: 'hidden',
  },
  proCardInner: {
    background:    'linear-gradient(135deg, #0044A0 0%, #0058BE 60%, #1A7FE0 100%)',
    borderRadius:   10,
    padding:       '14px 14px 12px',
    display:       'flex',
    flexDirection: 'column',
    gap:            4,
  },
  proTitle: {
    fontSize:      9,
    fontFamily:   'var(--font-family)',
    fontWeight:    700,
    color:        'rgba(255,255,255,0.65)',
    letterSpacing:'0.12em',
    textTransform:'uppercase',
  },
  proBody: {
    fontSize:   12,
    fontFamily: 'var(--font-family)',
    fontWeight: 600,
    color:      '#FFFFFF',
    lineHeight: 1.3,
    margin:     '2px 0 8px',
  },
  proBtn: {
    padding:      '6px 10px',
    border:       '1px solid rgba(255,255,255,0.35)',
    borderRadius:  6,
    background:   'transparent',
    color:        '#FFFFFF',
    fontSize:      11,
    fontFamily:   'var(--font-family)',
    fontWeight:    600,
    cursor:       'pointer',
    transition:   'background 0.12s ease',
    alignSelf:    'flex-start',
    whiteSpace:   'nowrap',
  },

  // Bottom links
  bottomLinks: {
    display:       'flex',
    flexDirection: 'column',
    gap:            2,
    marginTop:      4,
  },
  bottomLink: {
    display:    'flex',
    alignItems: 'center',
    gap:         10,
    height:      36,
    padding:    '0 12px',
    borderRadius: 8,
    border:     'none',
    background: 'transparent',
    color:      TEXT_TERTIARY,
    fontSize:    13,
    fontFamily: 'var(--font-family)',
    fontWeight:  500,
    cursor:     'pointer',
    width:      '100%',
    textAlign:  'left',
    transition: 'color 0.12s ease, background 0.12s ease',
    boxSizing:  'border-box',
    overflow:   'hidden',
    whiteSpace: 'nowrap',
  },

  // Theme toggle
  themeToggle: {
    display:    'flex',
    alignItems: 'center',
    gap:         10,
    height:      36,
    padding:    '0 12px',
    borderRadius: 8,
    border:     'none',
    background: 'transparent',
    color:      TEXT_SECONDARY,
    cursor:     'pointer',
    width:      '100%',
    textAlign:  'left',
    transition: 'color 0.12s ease',
    boxSizing:  'border-box',
    overflow:   'hidden',
    whiteSpace: 'nowrap',
  },

  lockIndicator: {
    display:     'flex',
    alignItems:  'center',
    gap:          4,
    padding:     '0 12px',
    marginTop:    2,
    color:       '#0058BE',
    fontSize:     10,
    fontFamily:  'var(--font-family)',
    fontWeight:   600,
    letterSpacing:'0.06em',
  },
  lockLabel: {
    textTransform: 'uppercase',
    letterSpacing:  '0.1em',
    fontSize:        9,
  },

  // Footer
  footer: {
    fontSize:   10,
    fontFamily: 'var(--font-family)',
    color:      TEXT_TERTIARY,
    lineHeight: 1.4,
    padding:   '10px 4px 0',
    whiteSpace: 'normal',
  },
}
