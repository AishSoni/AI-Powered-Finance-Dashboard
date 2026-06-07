import type { CSSProperties, FC } from 'react'

interface HeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

const Header: FC<HeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <header style={s.header}>
      <div>
        <h1 style={s.title}>{title}</h1>
        {subtitle && <p style={s.subtitle}>{subtitle}</p>}
      </div>
      {actions && <div className="page-header-actions" style={s.actions}>{actions}</div>}
    </header>
  )
}

const s: Record<string, CSSProperties> = {
  header: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 'var(--space-6)',
    gap: 'var(--space-4)',
    flexWrap: 'wrap',
  },
  title: {
    font: 'var(--font-heading-lg)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.01em',
  },
  subtitle: {
    font: 'var(--font-body-md)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-secondary)',
    marginTop: 'var(--space-1)',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    flexShrink: 0,
  },
}

export default Header
