import type { CSSProperties, FC } from 'react'
import React from 'react'
import {
  LayoutDashboard, Building2, ArrowLeftRight,
  Wallet, Sparkles, HelpCircle, LogOut,
  Sun, Moon, Zap,
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
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
}

// ─── Component ────────────────────────────────────────────────────────────────

const Sidebar: FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const { isDark, toggleTheme } = useTheme()
  const { trackEvent } = useAnalytics()

  const handleThemeToggle = () => {
    toggleTheme()
    trackEvent(ANALYTICS_EVENTS.THEME_TOGGLED, { to: isDark ? 'light' : 'dark' })
  }

  return (
    <aside style={s.sidebar} aria-label="Application sidebar">

      {/* ── Logo ── */}
      <div style={s.logoRow}>
        <div style={s.logoIcon} aria-hidden="true">
          <Zap size={16} color="#0058BE" strokeWidth={2.5} />
        </div>
        <div>
          <div style={s.logoName}>Proton Finance</div>
          <div style={s.logoSub}>WEALTH CURATOR</div>
        </div>
      </div>

      <div style={s.divider} role="separator" />

      {/* ── Nav ── */}
      <nav aria-label="Main navigation" style={s.nav}>
        {NAV_ITEMS.map(({ id, label, Icon, badge }) => {
          const isActive = activePage === id
          return (
            <button
              key={id}
              id={`nav-${id}`}
              style={isActive ? { ...s.navItem, ...s.navItemActive } : s.navItem}
              onClick={() => onNavigate(id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={label}
            >
              <span style={isActive ? { ...s.navIcon, ...s.navIconActive } : s.navIcon}>
                <Icon size={16} strokeWidth={1.75} />
              </span>
              <span style={s.navLabel}>{label}</span>
              {badge != null && (
                <span style={s.navBadge} aria-label={`${badge} unread`}>{badge}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* ── Spacer ── */}
      <div style={{ flex: 1 }} />

      {/* ── Pro Access card ── */}
      <div style={s.proCard}>
        <div style={s.proCardInner}>
          <Sparkles size={14} color="#fff" strokeWidth={2} style={{ marginBottom: 6 }} />
          <div style={s.proTitle}>PRO ACCESS</div>
          <div style={s.proBody}>Unlock AI Strategy Insights</div>
          <button style={s.proBtn} aria-label="Upgrade to Proton Finance Premium">
            Upgrade to Premium
          </button>
        </div>
      </div>

      {/* ── Bottom links ── */}
      <div style={s.bottomLinks}>
        <button style={s.bottomLink} aria-label="Help Center">
          <HelpCircle size={15} strokeWidth={1.75} />
          <span>Help Center</span>
        </button>
        <button style={s.bottomLink} aria-label="Log out">
          <LogOut size={15} strokeWidth={1.75} />
          <span>Logout</span>
        </button>
      </div>

      <div style={s.divider} role="separator" />

      {/* ── Theme toggle ── */}
      <button
        id="theme-toggle"
        style={s.themeToggle}
        onClick={handleThemeToggle}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark
          ? <Sun size={15} strokeWidth={1.75} />
          : <Moon size={15} strokeWidth={1.75} />}
        <span style={s.navLabel}>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
      </button>

      {/* ── Footer ── */}
      <p style={s.footer}>
        © 2026 Editorial Finance. All financial data is encrypted and secure.
      </p>
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
    width:           'var(--sidebar-width)',
    height:          '100vh',
    background:      SIDEBAR_BG,
    borderRight:     `1px solid ${SIDEBAR_BORDER}`,
    boxShadow:       '4px 0 24px rgba(0,0,0,0.5)',
    display:         'flex',
    flexDirection:   'column',
    padding:         '20px 12px 16px',
    zIndex:          100,
    overflowY:       'auto',
    overflowX:       'hidden',
    boxSizing:       'border-box',
  },

  // Logo
  logoRow: {
    display:        'flex',
    alignItems:     'center',
    gap:            10,
    padding:        '4px 4px 16px',
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
  logoName: {
    fontSize:       14,
    fontFamily:     'var(--font-family)',
    fontWeight:     700,
    color:          TEXT_PRIMARY,
    lineHeight:     1.2,
    letterSpacing:  '-0.01em',
  },
  logoSub: {
    fontSize:       9,
    fontFamily:     'var(--font-family)',
    fontWeight:     600,
    color:          '#F5A623',
    letterSpacing:  '0.12em',
    textTransform:  'uppercase',
    marginTop:      1,
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
  },
  navItemActive: {
    background:  'rgba(0,88,190,0.12)',
    borderLeft:  '3px solid #0058BE',
    color:       TEXT_PRIMARY,
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
    fontSize:   13,
    fontFamily: 'var(--font-family)',
    fontWeight: 500,
    flex:       1,
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

  // Pro card
  proCard: {
    margin:  '8px 0 4px',
  },
  proCardInner: {
    background:   'linear-gradient(135deg, #0044A0 0%, #0058BE 60%, #1A7FE0 100%)',
    borderRadius:  10,
    padding:      '14px 14px 12px',
    display:      'flex',
    flexDirection:'column',
    gap:          4,
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
  },

  // Bottom links
  bottomLinks: {
    display:       'flex',
    flexDirection: 'column',
    gap:           2,
    marginTop:     4,
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
  },

  // Footer
  footer: {
    fontSize:   10,
    fontFamily: 'var(--font-family)',
    color:      TEXT_TERTIARY,
    lineHeight: 1.4,
    padding:   '10px 4px 0',
  },
}
