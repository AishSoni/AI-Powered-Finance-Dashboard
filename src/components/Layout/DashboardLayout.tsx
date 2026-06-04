import type { FC, ReactNode } from 'react'
import Sidebar from './Sidebar'
import type { SidebarProps } from './Sidebar'

interface DashboardLayoutProps extends SidebarProps {
  children: ReactNode
  headerSlot?: ReactNode
}

/**
 * Root shell for all authenticated pages.
 *
 * Structure:
 *   <aside>  — fixed 240px dark Sidebar
 *   <main>   — scrollable content area (bg-base, no padding — pages own their spacing)
 *     <header> — sticky top bar (passed via headerSlot)
 *     page content (children)
 */
const DashboardLayout: FC<DashboardLayoutProps> = ({
  activePage,
  onNavigate,
  headerSlot,
  children,
}) => {
  return (
    <div style={s.shell}>
      {/* Fixed sidebar — always dark */}
      <Sidebar activePage={activePage} onNavigate={onNavigate} />

      {/* Scrollable main column */}
      <main style={s.main} id="main-content">
        {headerSlot && (
          <header style={s.headerWrapper}>
            {headerSlot}
          </header>
        )}
        <div style={s.pageContent}>
          {children}
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout

const s: Record<string, React.CSSProperties> = {
  shell: {
    display:  'flex',
    minHeight: '100vh',
    background: 'var(--color-bg-base)',
  },
  main: {
    marginLeft:    'var(--sidebar-width)',
    flex:           1,
    display:       'flex',
    flexDirection: 'column',
    minWidth:       0,         // prevent grid blowout
    minHeight:     '100vh',
    background:    'var(--color-bg-base)',
    overflowX:     'hidden',
  },
  headerWrapper: {
    position:   'sticky',
    top:         0,
    zIndex:      50,
    // Visual border drawn inside Header — header owns its own bg/border
  },
  pageContent: {
    flex: 1,
  },
}
