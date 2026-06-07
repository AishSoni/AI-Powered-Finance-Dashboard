import { type ChangeEvent, type CSSProperties, type FC, useCallback, useEffect, useRef, useState } from 'react'
import { Search, Bell, Settings, Sun, Moon, Menu, X } from 'lucide-react'
import { useTheme } from '@/context/theme'
import { useDebounce, useAnalytics, ANALYTICS_EVENTS } from '@/hooks'
import './Header.css'

// ─── Tab nav ──────────────────────────────────────────────────────────────────

const TABS = ['Portfolio', 'Analysis', 'Market'] as const
type Tab = typeof TABS[number]

// ─── Props ────────────────────────────────────────────────────────────────────

interface HeaderProps {
  /** Unread alert count — shows red dot when > 0 */
  unreadAlerts?: number
  /** On mobile, callback to open the sidebar drawer */
  onMenuOpen?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

const Header: FC<HeaderProps> = ({ unreadAlerts = 3, onMenuOpen }) => {
  const { isDark, toggleTheme } = useTheme()
  const { trackEvent, trackSearch } = useAnalytics()

  const [rawQuery, setRawQuery]     = useState('')
  const [activeTab, setActiveTab]   = useState<Tab>('Portfolio')
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef              = useRef<HTMLInputElement>(null)

  // Fire analytics only on settled input — not every keystroke
  const debouncedQuery = useDebounce(rawQuery, 300)
  const prevQueryRef   = useRef('')

  useEffect(() => {
    if (debouncedQuery === prevQueryRef.current) return
    prevQueryRef.current = debouncedQuery

    const term = debouncedQuery.trim()
    if (term) trackSearch(term)
  }, [debouncedQuery, trackSearch])

  // Focus input when search panel opens on mobile
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setRawQuery(event.target.value)
  }, [])

  const handleTabClick = useCallback((tab: Tab) => {
    setActiveTab(tab)
  }, [])

  const handleThemeToggle = useCallback(() => {
    const newTheme = isDark ? 'light' : 'dark'
    toggleTheme()
    trackEvent(ANALYTICS_EVENTS.THEME_TOGGLED, { newTheme })
  }, [isDark, toggleTheme, trackEvent])

  return (
    <div style={s.bar} role="banner">

      {/* ── Left: hamburger (mobile) ── */}
      <button
        className="header-menu-btn"
        style={s.menuBtn}
        aria-label="Open navigation menu"
        onClick={onMenuOpen}
      >
        <Menu size={20} strokeWidth={1.75} />
      </button>

      {/* ── Centre: search + tabs ── */}
      <div className="header-centre" style={s.centre}>
        {/* Search */}
        <div style={s.searchWrap} role="search">
          <label htmlFor="global-search" className="sr-only">Search portfolio or markets</label>
          <span style={s.searchIcon} aria-hidden="true">
            <Search size={15} strokeWidth={2} aria-hidden="true" />
          </span>
          <input
            ref={searchInputRef}
            id="global-search"
            type="search"
            style={s.searchInput}
            placeholder="Search portfolio or markets..."
            value={rawQuery}
            onChange={handleSearchChange}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {/* Tab nav */}
        <nav className="header-tabs" style={s.tabs} aria-label="Tab navigation">
          {TABS.map(tab => (
            <button
              key={tab}
              style={tab === activeTab ? { ...s.tab, ...s.tabActive } : s.tab}
              onClick={() => handleTabClick(tab)}
              aria-current={tab === activeTab ? 'true' : undefined}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Mobile search toggle ── */}
      <button
        className="header-search-toggle"
        style={s.searchToggle}
        aria-label="Toggle search"
        onClick={() => setSearchOpen(o => !o)}
      >
        {searchOpen ? <X size={18} strokeWidth={1.75} /> : <Search size={18} strokeWidth={1.75} />}
      </button>

      {/* ── Right: actions ── */}
      <div style={s.right}>

        {/* Notifications bell */}
        <button
          style={s.iconBtn}
          aria-label={`${unreadAlerts} unread alerts`}
        >
          <span style={s.bellWrap}>
            <Bell size={18} strokeWidth={1.75} aria-hidden="true" />
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
            ? <Sun  size={18} strokeWidth={1.75} aria-hidden="true" />
            : <Moon size={18} strokeWidth={1.75} aria-hidden="true" />}
        </button>

        {/* Settings — hidden on small mobile */}
        <button className="header-settings-btn" style={s.settingsBtn} aria-label="Settings">
          <Settings size={15} strokeWidth={1.75} aria-hidden="true" />
          <span className="header-settings-label">Settings</span>
        </button>

        {/* Divider */}
        <div className="header-vdivider" style={s.vDivider} role="separator" />

        {/* User */}
        <div style={s.user}>
          <div style={s.avatar} aria-label="User avatar: Alexander Sterling">
            AS
          </div>
          <span className="header-username" style={s.userName}>Alexander Sterling</span>
        </div>
      </div>

      {/* ── Mobile search overlay ── */}
      {searchOpen && (
        <div className="header-search-overlay" style={s.searchOverlay}>
          <div style={s.searchWrap} role="search">
            <span style={s.searchIcon} aria-hidden="true">
              <Search size={15} strokeWidth={2} />
            </span>
            <input
              type="search"
              style={s.searchInput}
              placeholder="Search portfolio or markets..."
              value={rawQuery}
              onChange={handleSearchChange}
              autoComplete="off"
              spellCheck={false}
              autoFocus
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Header

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, CSSProperties> = {
  bar: {
    minHeight:     56,
    display:       'flex',
    alignItems:    'center',
    justifyContent:'flex-end',
    padding:       '0 16px',
    background:    'var(--color-bg-surface)',
    borderBottom:  '1px solid var(--color-border)',
    gap:            12,
    flexShrink:    0,
    position:      'relative',
    flexWrap:      'wrap',
  },

  menuBtn: {
    display:        'none',  // shown via CSS media query
    width:           36,
    height:          36,
    border:         'none',
    borderRadius:   'var(--radius-md)',
    background:     'transparent',
    color:          'var(--color-text-secondary)',
    cursor:         'pointer',
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
  },

  // Centre cluster
  centre: {
    flex:       1,
    display:    'flex',
    alignItems: 'center',
    gap:         16,
    minWidth:    0,
  },

  // Search
  searchWrap: {
    position:   'relative',
    width:       320,
    maxWidth:   '100%',
    flexShrink:  1,
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
    whiteSpace:     'nowrap',
  },
  tabActive: {
    color:        'var(--color-text-primary)',
    borderBottom: '2px solid var(--color-primary)',
  },

  // Mobile search toggle (hidden on desktop via CSS)
  searchToggle: {
    display:        'none',
    width:           36,
    height:          36,
    border:         'none',
    borderRadius:   'var(--radius-md)',
    background:     'transparent',
    color:          'var(--color-text-secondary)',
    cursor:         'pointer',
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
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

  // Mobile search overlay
  searchOverlay: {
    position:   'absolute',
    top:         '100%',
    left:         0,
    right:        0,
    padding:    '10px 16px',
    background: 'var(--color-bg-surface)',
    borderBottom:'1px solid var(--color-border)',
    zIndex:      200,
    boxShadow:  'var(--shadow-elevated)',
  },
}
