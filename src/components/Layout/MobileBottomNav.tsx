import { Grid2x2, BarChart3, Sparkles, Settings } from 'lucide-react'
import { useState } from 'react'
import './MobileBottomNav.css'

type TabId = 'portfolio' | 'analysis' | 'insights' | 'settings'

interface Tab {
  id: TabId
  icon: typeof Grid2x2
  label: string
}

const TABS: Tab[] = [
  { id: 'portfolio', icon: Grid2x2, label: 'Portfolio' },
  { id: 'analysis', icon: BarChart3, label: 'Analysis' },
  { id: 'insights', icon: Sparkles, label: 'Insights' },
  { id: 'settings', icon: Settings, label: 'Settings' },
]

export const MobileBottomNav = () => {
  const [activeTab, setActiveTab] = useState<TabId>('portfolio')

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {TABS.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            className={`mobile-nav-tab ${isActive ? 'mobile-nav-tab--active' : 'mobile-nav-tab--inactive'}`}
            onClick={() => setActiveTab(tab.id)}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon size={20} strokeWidth={2} />
            {isActive && <span className="mobile-nav-tab__label">{tab.label}</span>}
          </button>
        )
      })}
    </nav>
  )
}
