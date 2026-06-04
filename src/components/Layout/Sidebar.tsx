import type { CSSProperties, FC } from 'react'
import { useTheme } from '@/context/ThemeContext'

// ── Icons (inline SVG, no deps) ───────────────────────────────────────────────
const IconDashboard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
)
const IconPortfolio = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)
const IconBudget = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)
const IconTransactions = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" /><polyline points="3 6 4 7 6 5" />
    <polyline points="3 12 4 13 6 11" /><polyline points="3 18 4 19 6 17" />
  </svg>
)
const IconAlerts = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)
const IconSun = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)
const IconMoon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const navItems = [
  { id: 'dashboard',     label: 'Dashboard',    icon: <IconDashboard /> },
  { id: 'portfolio',     label: 'Portfolio',    icon: <IconPortfolio /> },
  { id: 'budget',        label: 'Budget',       icon: <IconBudget /> },
  { id: 'transactions',  label: 'Transactions', icon: <IconTransactions /> },
  { id: 'alerts',        label: 'Alerts',       icon: <IconAlerts />, badge: 3 },
]

interface SidebarProps {
  activePage: string
  onNavigate: (page: string) => void
}

const Sidebar: FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <aside style={s.sidebar}>
      {/* Brand */}
      <div style={s.brand}>
        <div style={s.brandIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#0058BE" />
          </svg>
        </div>
        <div>
          <div style={s.brandName}>Proton</div>
          <div style={s.brandSub}>Finance</div>
        </div>
      </div>

      <div style={s.divider} />

      {/* Section label */}
      <div style={s.sectionLabel}>MENU</div>

      {/* Nav */}
      <nav style={s.nav}>
        {navItems.map((item) => {
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              style={{ ...s.navItem, ...(isActive ? s.navItemActive : {}) }}
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <span style={{ ...s.navIcon, ...(isActive ? s.navIconActive : {}) }}>
                {item.icon}
              </span>
              <span style={s.navLabel}>{item.label}</span>
              {item.badge ? (
                <span style={s.navBadge}>{item.badge}</span>
              ) : null}
            </button>
          )
        })}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Theme toggle */}
      <div style={s.sectionLabel}>APPEARANCE</div>
      <button id="theme-toggle" style={s.themeToggle} onClick={toggleTheme}>
        <span style={s.navIcon}>{isDark ? <IconSun /> : <IconMoon />}</span>
        <span style={s.navLabel}>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
      </button>

      {/* User */}
      <div style={s.divider} />
      <div style={s.user}>
        <div style={s.userAvatar}>JD</div>
        <div>
          <div style={s.userName}>James Donovan</div>
          <div style={s.userRole}>Wealth Manager</div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

/* ── Styles ── */
const s: Record<string, CSSProperties> = {
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: 'var(--sidebar-width)',
    height: '100vh',
    background: 'var(--color-bg-sidebar)',
    borderRight: '1px solid var(--color-border-subtle)',
    boxShadow: 'var(--shadow-sidebar)',
    display: 'flex',
    flexDirection: 'column',
    padding: 'var(--space-5)',
    gap: 'var(--space-2)',
    zIndex: 100,
    overflowY: 'auto',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    padding: 'var(--space-2) 0 var(--space-4)',
  },
  brandIcon: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(0,88,190,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(0,88,190,0.3)',
    flexShrink: 0,
  },
  brandName: {
    font: 'var(--font-heading-md)',
    fontFamily: 'var(--font-family)',
    color: '#FFFFFF',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  brandSub: {
    font: 'var(--font-label-sm)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-tertiary)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  divider: {
    height: '1px',
    background: 'var(--color-border-subtle)',
    margin: 'var(--space-2) 0',
  },
  sectionLabel: {
    fontSize: '0.625rem',
    fontFamily: 'var(--font-family)',
    fontWeight: 600,
    color: 'var(--color-text-tertiary)',
    letterSpacing: '0.1em',
    padding: 'var(--space-2) var(--space-2) var(--space-1)',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    padding: '10px var(--space-3)',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    background: 'transparent',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    transition: 'all 0.15s ease',
  },
  navItemActive: {
    background: 'rgba(0,88,190,0.15)',
    color: '#FFFFFF',
    borderLeft: '2px solid var(--color-primary)',
  },
  navIcon: {
    color: 'var(--color-text-tertiary)',
    flexShrink: 0,
    display: 'flex',
  },
  navIconActive: {
    color: 'var(--color-primary)',
  },
  navLabel: {
    font: 'var(--font-body-md)',
    fontFamily: 'var(--font-family)',
    fontWeight: 500,
    flex: 1,
  },
  navBadge: {
    minWidth: '18px',
    height: '18px',
    borderRadius: '99px',
    background: 'var(--color-error)',
    color: '#fff',
    fontSize: '10px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 5px',
  },
  themeToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    padding: '10px var(--space-3)',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    background: 'transparent',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    transition: 'all 0.15s ease',
  },
  user: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    padding: 'var(--space-3) var(--space-2)',
    marginTop: 'var(--space-2)',
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'var(--color-primary)',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    letterSpacing: '0.05em',
  },
  userName: {
    font: 'var(--font-body-md)',
    fontFamily: 'var(--font-family)',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    lineHeight: 1.3,
  },
  userRole: {
    font: 'var(--font-label-sm)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-tertiary)',
  },
}

export type { SidebarProps }
