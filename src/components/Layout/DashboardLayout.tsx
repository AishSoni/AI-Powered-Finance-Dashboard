import type { FC, ReactNode, CSSProperties } from 'react'
import { useState, useCallback, useEffect } from 'react'
import Sidebar from './Sidebar'
import type { SidebarProps } from './Sidebar'
import { MobileBottomNav } from './MobileBottomNav'
import Header from '@/components/Header/Header'
import './DashboardLayout.css'

interface DashboardLayoutProps extends Pick<SidebarProps, 'activePage' | 'onNavigate'> {
  children: ReactNode
}

const SIDEBAR_EXPANDED_WIDTH  = 240
const SIDEBAR_COLLAPSED_WIDTH = 60
const MOBILE_BP = 768

// matchMedia singleton — created once at module level so HMR doesn't reset it
const mq = typeof window !== 'undefined'
  ? window.matchMedia(`(max-width: ${MOBILE_BP - 1}px)`)
  : null

const DashboardLayout: FC<DashboardLayoutProps> = ({
  activePage,
  onNavigate,
  children,
}) => {
  const [isLocked,    setIsLocked]    = useState(true)
  const [isHovered,   setIsHovered]   = useState(false)
  const [isMobileOpen, setMobileOpen] = useState(false)

  // Sync with matchMedia so JS and CSS always agree
  const [isMobile, setIsMobile] = useState(() => mq?.matches ?? false)

  useEffect(() => {
    if (!mq) return
    // Re-check immediately in case the value changed before this effect ran
    setIsMobile(mq.matches)
    if (mq.matches) { /* already mobile */ }

    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
      if (!e.matches) setMobileOpen(false)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileOpen])

  // Desktop sidebar state
  const isExpanded = isLocked || isHovered

  const handleHoverExpand   = useCallback(() => { if (!isLocked) setIsHovered(true)  }, [isLocked])
  const handleHoverCollapse = useCallback(() => { if (!isLocked) setIsHovered(false) }, [isLocked])
  const handleLockToggle    = useCallback(() => { setIsLocked(p => !p); setIsHovered(false) }, [])

  const handleMobileOpen  = useCallback(() => setMobileOpen(true),  [])
  const handleMobileClose = useCallback(() => setMobileOpen(false), [])

  // Main content left margin
  const mainMargin = isMobile ? 0 : (isExpanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH)

  return (
    <div className="dashboard-shell" style={s.shell}>
      <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>

      {/* ══ MOBILE LAYOUT ═══════════════════════════════════════════════════════ */}
      {isMobile && (
        <>
          {/* Backdrop — click to close */}
          {isMobileOpen && (
            <div
              style={s.backdrop}
              onClick={handleMobileClose}
              aria-hidden="true"
            />
          )}

          {/*
           * Sidebar rendered directly with asideTransform.
           * The transform is applied ON the <aside> itself (position:fixed),
           * so there is no wrapper-div containing-block issue.
           * Closed  → translateX(-100%) = off-screen left
           * Open    → translateX(0)     = on screen
           */}
          <Sidebar
            asideTransform={isMobileOpen ? 'translateX(0)' : 'translateX(-100%)'}
            asideZIndex={200}
            asideClassName="mobile-sidebar-aside"
            activePage={activePage}
            onNavigate={(page) => { onNavigate(page); setMobileOpen(false) }}
            isExpanded={true}
            isLocked={true}
            onHoverExpand={() => {}}
            onHoverCollapse={() => {}}
            onLockToggle={() => {}}
          />
        </>
      )}

      {/* ══ DESKTOP LAYOUT ══════════════════════════════════════════════════════ */}
      {!isMobile && (
        <Sidebar
          asideClassName="desktop-sidebar-aside"
          activePage={activePage}
          onNavigate={onNavigate}
          isExpanded={isExpanded}
          isLocked={isLocked}
          onHoverExpand={handleHoverExpand}
          onHoverCollapse={handleHoverCollapse}
          onLockToggle={handleLockToggle}
        />
      )}

      {/* ══ MAIN CONTENT ════════════════════════════════════════════════════════ */}
      <main
        className="dashboard-main"
        style={{ ...s.main, marginLeft: mainMargin }}
        id="main-content"
      >
        <header style={s.headerWrapper}>
          <Header unreadAlerts={3} onMenuOpen={handleMobileOpen} />
        </header>

        <div style={s.pageContent}>
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      {isMobile && <MobileBottomNav />}
    </div>
  )
}

export default DashboardLayout

const s: Record<string, CSSProperties> = {
  shell: {
    display:    'flex',
    minHeight:  '100vh',
    background: 'var(--color-bg-base)',
  },
  main: {
    flex:          1,
    display:       'flex',
    flexDirection: 'column',
    minWidth:      0,
    minHeight:     '100vh',
    background:    'var(--color-bg-base)',
    overflowX:     'hidden',
    transition:    'margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  headerWrapper: {
    position: 'sticky',
    top:       0,
    zIndex:    50,
  },
  pageContent: {
    flex: 1,
  },
  backdrop: {
    position:             'fixed',
    inset:                 0,
    background:           'rgba(0,0,0,0.65)',
    zIndex:                150,
    backdropFilter:       'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)',
  },
}
