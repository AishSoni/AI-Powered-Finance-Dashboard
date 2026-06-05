import { Component, type ErrorInfo, type ReactNode, type CSSProperties } from 'react'
import { Zap } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Dashboard error boundary caught an error', error, info)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main style={s.shell} aria-label="Dashboard error">
        <section style={s.card}>
          <div style={s.logo}>
            <Zap size={20} color="#0058BE" strokeWidth={2.5} aria-hidden="true" />
          </div>
          <div style={s.brand}>Proton Finance</div>
          <h1 style={s.title}>Something went wrong</h1>
          <p style={s.body}>Reload the dashboard to restore your financial workspace.</p>
          <button className="btn-primary" onClick={this.handleReload}>
            Reload Dashboard
          </button>
        </section>
      </main>
    )
  }
}

const s: Record<string, CSSProperties> = {
  shell: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    background: 'var(--color-bg-base)',
  },
  card: {
    width: 'min(420px, 100%)',
    background: 'var(--color-bg-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-elevated)',
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    textAlign: 'center',
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 10,
    background: 'rgba(0,88,190,0.15)',
    border: '1px solid rgba(0,88,190,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontSize: 13,
    fontFamily: 'var(--font-family)',
    fontWeight: 700,
    color: 'var(--color-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  title: {
    font: 'var(--font-heading-lg)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-primary)',
    margin: '8px 0 0',
  },
  body: {
    font: 'var(--font-body-sm)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-secondary)',
    margin: '0 0 8px',
  },
}

export default ErrorBoundary
