import { type CSSProperties, type FC, useRef } from 'react'
import { Search, Bell, Settings, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useDebounce, useAnalytics, ANALYTICS_EVENTS } from '@/hooks'
import { useState } from 'react'

// ─── Tab nav ──────────────────────────────────────────────────────────────────

const TABS = ['Portfolio', 'Analysis', 'Market'] as const
type Tab = typeof TABS[number]

// ─── Props ────────────────────────────────────────────────────────────────────

interface HeaderProps {
  /** Unread alert count — shows red dot when > 0 */
  unreadAlerts?: number
}

// ─── Component ────────────────────────────────────────────────────────────────

const Header: FC<HeaderProps> = ({ unreadAlerts = 3 }) => {
  const { isDark, toggleTheme } = useTheme()
  const { trackEvent, trackSearch } = useAnalytics()

  const [rawQuery, setRawQuery] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('Portfolio')

  // Fire analytics only on settled input — not every keystroke
  const debouncedQuery = useDebounce(rawQuery, 300)
  const prevQueryRef   = useRef('')

  // Trigger search event when debounced value actually changes
  if (debouncedQuery !== prevQueryRef.current) {
    prevQueryRef.current = debouncedQuery
    if (debouncedQuery.trim()) trackSearch(debouncedQuery)
  }

  const handleThemeToggle = () => {
    toggleTheme()
    trackEvent(ANALYTICS_EVENTS.THEME_TOGGLED, { to: isDark ? 'light' : 'dark' })
  }

  return (
    <div style={s.bar} role="banner">

      {/* ── Centre: search + tabs ── */}
      <div style={s.centre}>
        {/* Search */}
        <div style={s.searchWrap} role="search">
          <span style={s.searchIcon} aria-hidden="true">
            <Search size={15} strokeWidth={2} />
          </span>
          <input
            id="header-search"
            type="search"
            style={s.searchInput}
            placeholder="Search portfolio or markets..."
            value={rawQuery}
            onChange={e => setRawQuery(e.target.value)}
            aria-label="Search portfolio or markets"
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {/* Tab nav */}
        <nav style={s.tabs} aria-label="Section navigation">
          {TABS.map(tab => (
            <button
              key={tab}
              style={tab === activeTab ? { ...s.tab, ...s.tabActive } : s.tab}
              onClick={() => setActiveTab(tab)}
              aria-current={tab === activeTab ? 'true' : undefined}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Right: actions ── */}
      <div style={s.right}>

        {/* Notifications bell */}
        <button
          style={s.iconBtn}
          aria-label={`${unreadAlerts} unread alerts`}
        >
          <span style={s.bellWrap}>
            <Bell size={18} strokeWidth={1.75} />
            {unreadAlerts > 0 && (
              <span style={s.notifDot} aria-hidden="true" />
            )}
          </span>
        </button>

        {/* Theme toggle */}
        <button
          id="header-theme-toggle"
          style={s.iconBtn}
          onClick={handleThemeToggle}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark
            ? <Sun  size={18} strokeWidth={1.75} />
            : <Moon size={18} strokeWidth={1.75} />}
        </button>

        {/* Settings */}
        <button style={s.settingsBtn} aria-label="Settings">
          <Settings size={15} strokeWidth={1.75} />
          <span>Settings</span>
        </button>

        {/* Divider */}
        <div style={s.vDivider} role="separator" />

        {/* User */}
        <div style={s.user}>
          <div style={s.avatar} aria-label="User avatar: Alexander Sterling">
            AS
          </div>
          <span style={s.userName}>Alexander Sterling</span>
        </div>
      </div>
    </div>
  )
}

export default Header

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, CSSProperties> = {
  bar: {
    height:        56,
    display:       'flex',
    alignItems:    'center',
    justifyContent:'flex-end',
    padding:       '0 24px',
    background:    'var(--color-bg-surface)',
    borderBottom:  '1px solid var(--color-border)',
    gap:           16,
    flexShrink:    0,
  },

  // Centre cluster
  centre: {
    flex:       1,
    display:    'flex',
    alignItems: 'center',
    gap:        16,
    minWidth:   0,
  },

  // Search
  searchWrap: {
    position:   'relative',
    width:       320,
    flexShrink:  0,
    display:    'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position:  'absolute',
    left:       10,
    color:     'var(--color-text-tertiary)',
    display:   'flex',
    pointerEvents: 'none',
  },
  searchInput: {
    width:          '100%',
    height:          34,
    paddingLeft:     34,
    paddingRight:    12,
    background:     'var(--color-bg-input)',
    border:         '1px solid var(--color-border)',
    borderRadius:   'var(--radius-md)',
    color:          'var(--color-text-primary)',
    fontSize:        13,
    fontFamily:     'var(--font-family)',
    outline:        'none',
    transition:     'border-color 0.12s ease',
  },

  // Tabs
  tabs: {
    display:    'flex',
    alignItems: 'center',
    gap:         4,
  },
  tab: {
    padding:        '4px 10px',
    border:         'none',
    background:     'transparent',
    color:          'var(--color-text-tertiary)',
    fontSize:        13,
    fontFamily:     'var(--font-family)',
    fontWeight:      500,
    cursor:         'pointer',
    borderBottom:   '2px solid transparent',
    transition:     'color 0.12s ease, border-color 0.12s ease',
    paddingBottom:   6,
  },
  tabActive: {
    color:        'var(--color-text-primary)',
    borderBottom: '2px solid var(--color-primary)',
  },

  // Right section
  right: {
    display:    'flex',
    alignItems: 'center',
    gap:         8,
    flexShrink:  0,
  },

  iconBtn: {
    width:          34,
    height:         34,
    border:         'none',
    borderRadius:   'var(--radius-md)',
    background:     'transparent',
    color:          'var(--color-text-secondary)',
    cursor:         'pointer',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    transition:     'background 0.12s ease, color 0.12s ease',
    flexShrink:     0,
  },

  // Bell with notification dot
  bellWrap: {
    position: 'relative',
    display:  'flex',
  },
  notifDot: {
    position:     'absolute',
    top:           -2,
    right:         -2,
    width:          7,
    height:         7,
    borderRadius:  '50%',
    background:   '#D93025',
    border:       '1.5px solid var(--color-bg-surface)',
  },

  settingsBtn: {
    display:    'flex',
    alignItems: 'center',
    gap:         6,
    padding:    '0 10px',
    height:      34,
    border:     '1px solid var(--color-border)',
    borderRadius:'var(--radius-md)',
    background: 'transparent',
    color:      'var(--color-text-secondary)',
    fontSize:    13,
    fontFamily: 'var(--font-family)',
    fontWeight:  500,
    cursor:     'pointer',
    transition: 'background 0.12s ease, color 0.12s ease',
    flexShrink:  0,
  },

  vDivider: {
    width:      1,
    height:     22,
    background: 'var(--color-border)',
    flexShrink: 0,
  },

  // User
  user: {
    display:    'flex',
    alignItems: 'center',
    gap:         10,
  },
  avatar: {
    width:          32,
    height:         32,
    borderRadius:  '50%',
    background:    'var(--color-primary)',
    border:        '2px solid #F5A623',
    color:         '#fff',
    fontSize:       11,
    fontFamily:    'var(--font-family)',
    fontWeight:     700,
    display:       'flex',
    alignItems:    'center',
    justifyContent:'center',
    letterSpacing: '0.04em',
    flexShrink:     0,
    cursor:        'pointer',
  },
  userName: {
    fontSize:   14,
    fontFamily: 'var(--font-family)',
    fontWeight:  500,
    color:      'var(--color-text-primary)',
    whiteSpace: 'nowrap',
  },
}
