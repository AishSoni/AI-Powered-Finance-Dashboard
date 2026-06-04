import '@/styles/globals.css'
import { useState } from 'react'
import { ThemeProvider } from '@/context/ThemeContext'
import Sidebar from '@/components/Layout/Sidebar'
import Dashboard from '@/pages/Dashboard'

// Page registry — add new pages here as they are built
const PAGES: Record<string, React.ReactNode> = {
  dashboard: <Dashboard />,
  // portfolio: <Portfolio />,
  // budget: <Budget />,
  // transactions: <Transactions />,
  // alerts: <Alerts />,
}

function AppShell() {
  const [activePage, setActivePage] = useState('dashboard')

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="main-content">
        {PAGES[activePage] ?? <Dashboard />}
      </main>
    </div>
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
