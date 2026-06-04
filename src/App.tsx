import '@/styles/globals.css'
import { useState } from 'react'
import { ThemeProvider } from '@/context/ThemeContext'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import Header from '@/components/Header/Header'
import Dashboard from '@/pages/Dashboard'

// ── Page registry — extend as new pages are built ─────────────────────────────
const PAGES: Record<string, React.ReactNode> = {
  dashboard:    <Dashboard />,
  accounts:     <Dashboard />, // placeholder
  transactions: <Dashboard />, // placeholder
  budgets:      <Dashboard />, // placeholder
  insights:     <Dashboard />, // placeholder
}

function AppShell() {
  const [activePage, setActivePage] = useState('dashboard')

  return (
    <DashboardLayout
      activePage={activePage}
      onNavigate={setActivePage}
      headerSlot={<Header unreadAlerts={3} />}
    >
      {PAGES[activePage] ?? <Dashboard />}
    </DashboardLayout>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  )
}

export default App
