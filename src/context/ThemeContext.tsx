import { useCallback, useEffect, useMemo, type ReactNode } from 'react'
import { ThemeContext, type Theme } from './theme'
import { useLocalStorage } from '@/hooks'

// ─── Meta theme-color values ──────────────────────────────────────────────────
const META_COLORS: Record<Theme, string> = {
  dark:  '#0D1117',
  light: '#F4F6FA',
}

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * Wraps the app with theme state persisted under localStorage key "pf-theme".
 * The "pf-" namespace prefix is handled automatically by useLocalStorage.
 *
 * Side effects on theme change:
 *  - Sets document.documentElement[data-theme] to drive CSS custom properties
 *  - Updates <meta name="theme-color"> for browser chrome tinting
 *
 * @exports ThemeProvider, useTheme (re-exported from ./theme for convenience)
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'dark')

  useEffect(() => {
    // Drive CSS design token cascade
    document.documentElement.setAttribute('data-theme', theme)

    // Update or create <meta name="theme-color">
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'theme-color'
      document.head.appendChild(meta)
    }
    meta.content = META_COLORS[theme]
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev: Theme) => (prev === 'dark' ? 'light' : 'dark'))
  }, [setTheme])

  const value = useMemo(() => ({
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  }), [theme, toggleTheme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// Re-export useTheme for single-import convenience
export { useTheme } from './theme'
