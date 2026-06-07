import '@/styles/globals.css'
import { lazy, Suspense, useEffect, useMemo, useRef, useState, type ComponentType } from 'react'
import { ThemeProvider } from '@/context/ThemeContext'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import Dashboard from '@/pages/Dashboard'
import { ChartSkeleton } from '@/components/Charts'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { useAnalytics } from '@/hooks'

const BudgetPage   = lazy(() => import('@/pages/BudgetPage'))
const InsightsPage = lazy(() => import('@/pages/InsightsPage'))

const PAGES: Record<string, ComponentType> = {
  dashboard:    Dashboard,
  accounts:     Dashboard,
  transactions: Dashboard,
  budgets:      BudgetPage,
  insights:     InsightsPage,
}

function AppShell() {
  const [activePage, setActivePage] = useState('dashboard')
  const { trackPageView }           = useAnalytics()
  const trackedInitialPage          = useRef(false)
  const ActivePage = useMemo(() => PAGES[activePage] ?? Dashboard, [activePage])

  useEffect(() => {
    if (trackedInitialPage.current) return
    trackedInitialPage.current = true
    trackPageView('dashboard', 'Proton Finance Dashboard')
  }, [trackPageView])

  return (
    <DashboardLayout
      activePage={activePage}
      onNavigate={setActivePage}
    >
      <Suspense fallback={<ChartSkeleton height={240} />}>
        <ActivePage />
      </Suspense>
    </DashboardLayout>
  )
}

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AppShell />
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default App
