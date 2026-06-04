import type { FC, ReactNode } from 'react'
import Sidebar from './Sidebar'
import type { SidebarProps } from './Sidebar'
import './DashboardLayout.css'

interface DashboardLayoutProps extends SidebarProps {
  children: ReactNode
  headerSlot?: ReactNode
}

const DashboardLayout: FC<DashboardLayoutProps> = ({
  activePage,
  onNavigate,
  headerSlot,
  children,
}) => {
  return (
    <div className="dashboard-shell" style={s.shell}>
      {/* Fixed sidebar — always dark */}
      <Sidebar activePage={activePage} onNavigate={onNavigate} />

      {/* Scrollable main column */}
      <main className="dashboard-main" style={s.main} id="main-content">
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
