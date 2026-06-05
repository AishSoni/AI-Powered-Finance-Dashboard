import type { FC, ReactNode, CSSProperties } from 'react'
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
      <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>
      <Sidebar activePage={activePage} onNavigate={onNavigate} />

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

const s: Record<string, CSSProperties> = {
  shell: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--color-bg-base)',
  },
  main: {
    marginLeft: 'var(--sidebar-width)',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    minHeight: '100vh',
    background: 'var(--color-bg-base)',
    overflowX: 'hidden',
  },
  headerWrapper: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  pageContent: {
    flex: 1,
  },
}
