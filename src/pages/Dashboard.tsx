import type { FC } from 'react'

/* ── Types ────────────────────────────────────────────────────────────────── */
interface Stat {
  label: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: string
}

interface AssetRow {
  name: string
  ticker: string
  allocation: number
  value: string
  change: string
  changeType: 'positive' | 'negative'
}

/* ── Mock data ────────────────────────────────────────────────────────────── */
const stats: Stat[] = [
  { label: 'Total AUM',      value: '$4.82M',  change: '+3.2%',  changeType: 'positive', icon: '◈' },
  { label: 'Net Returns',    value: '$128.4K', change: '+8.7%',  changeType: 'positive', icon: '◎' },
  { label: 'Active Clients', value: '248',     change: '+12',    changeType: 'positive', icon: '◉' },
  { label: 'Risk Score',     value: '6.4/10',  change: '-0.3',   changeType: 'negative', icon: '◊' },
]

const assets: AssetRow[] = [
  { name: 'Apple Inc.',    ticker: 'AAPL', allocation: 28, value: '$1.35M', change: '+2.4%', changeType: 'positive' },
  { name: 'US Treasury',   ticker: 'TLT',  allocation: 22, value: '$1.06M', change: '-0.3%', changeType: 'negative' },
  { name: 'Gold ETF',      ticker: 'GLD',  allocation: 18, value: '$867K',  change: '+1.8%', changeType: 'positive' },
  { name: 'NVIDIA Corp.',  ticker: 'NVDA', allocation: 15, value: '$723K',  change: '+5.1%', changeType: 'positive' },
  { name: 'Real Estate',   ticker: 'VNQ',  allocation: 10, value: '$482K',  change: '+0.6%', changeType: 'positive' },
  { name: 'Cash & Equiv.', ticker: 'CASH', allocation: 7,  value: '$336K',  change: '0.0%',  changeType: 'positive' },
]

/* ── Component ────────────────────────────────────────────────────────────── */
const Dashboard: FC = () => {
  return (
    <div style={styles.root}>
      {/* Ambient background orbs */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      {/* ── Header ── */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.logo}>⬡</span>
          <span style={styles.logoText}>BrightMoney</span>
        </div>
        <nav style={styles.nav}>
          {['Portfolio', 'Analytics', 'Clients', 'Reports'].map((item) => (
            <a key={item} href="#" style={styles.navItem}>{item}</a>
          ))}
        </nav>
        <div style={styles.headerRight}>
          <div style={styles.avatar}>JD</div>
        </div>
      </header>

      {/* ── Main ── */}
      <main style={styles.main}>

        {/* Hero */}
        <section style={styles.hero}>
          <div>
            <p style={styles.heroEyebrow}>Welcome back, James  ·  Q2 2026</p>
            <h1 style={styles.heroTitle}>
              Wealth Curator
              <br />
              <span className="text-gradient-gold">Dashboard</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Institutional-grade portfolio intelligence at your fingertips.
            </p>
          </div>
          <div style={styles.heroActions}>
            <button className="btn-gold">New Report</button>
            <button className="btn-ghost">View All Clients</button>
          </div>
        </section>

        {/* KPI Stats */}
        <section style={styles.statsGrid} aria-label="Key performance indicators">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card" style={styles.statCard}>
              <div style={styles.statHeader}>
                <span style={styles.statIcon}>{stat.icon}</span>
                <span
                  className={`stat-badge ${
                    stat.changeType === 'positive'
                      ? 'stat-badge-success'
                      : stat.changeType === 'negative'
                      ? 'stat-badge-error'
                      : ''
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p style={styles.statValue}>{stat.value}</p>
              <p style={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Content grid */}
        <div style={styles.contentGrid}>

          {/* Allocation chart placeholder */}
          <section className="glass-card" style={styles.chartCard}>
            <div style={styles.cardHeaderRow}>
              <h2 style={styles.cardTitle}>Asset Allocation</h2>
              <div className="divider-gold" />
            </div>
            <div style={styles.donutPlaceholder} aria-label="Donut chart placeholder">
              <div style={styles.donutRing}>
                <div style={styles.donutCenter}>
                  <span style={styles.donutValue}>$4.82M</span>
                  <span style={styles.donutLabel}>Total AUM</span>
                </div>
              </div>
            </div>
            {/* Legend */}
            <div style={styles.legend}>
              {assets.map((a) => (
                <div key={a.ticker} style={styles.legendItem}>
                  <div style={{ ...styles.legendDot, opacity: a.allocation / 30 + 0.3 }} />
                  <span style={styles.legendName}>{a.ticker}</span>
                  <span style={styles.legendPct}>{a.allocation}%</span>
                </div>
              ))}
            </div>
          </section>

          {/* Holdings table */}
          <section className="glass-card" style={styles.tableCard}>
            <div style={styles.cardHeaderRow}>
              <h2 style={styles.cardTitle}>Holdings</h2>
              <button className="btn-ghost" style={{ padding: '4px 14px', fontSize: '0.75rem' }}>
                Export CSV
              </button>
            </div>
            <div style={styles.tableWrapper} role="table" aria-label="Portfolio holdings">
              <div style={styles.tableHead} role="row">
                {['Asset', 'Ticker', 'Allocation', 'Value', 'Change'].map((h) => (
                  <span key={h} style={styles.th} role="columnheader">{h}</span>
                ))}
              </div>
              {assets.map((row) => (
                <div key={row.ticker} style={styles.tableRow} role="row">
                  <span style={styles.tdAsset} role="cell">{row.name}</span>
                  <span style={styles.tdTicker} role="cell">{row.ticker}</span>
                  <span style={styles.tdAlloc} role="cell">
                    <div style={styles.allocBar}>
                      <div style={{ ...styles.allocFill, width: `${row.allocation * 3}px` }} />
                    </div>
                    <span>{row.allocation}%</span>
                  </span>
                  <span style={styles.tdValue} role="cell">{row.value}</span>
                  <span
                    style={{
                      ...styles.tdChange,
                      color: row.changeType === 'positive'
                        ? 'var(--color-success)'
                        : 'var(--color-error)',
                    }}
                    role="cell"
                  >
                    {row.change}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

/* ── Inline styles (CSS vars only) ───────────────────────────────────────── */
const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: '100vh',
    background: 'var(--color-bg-primary)',
    position: 'relative',
    overflow: 'hidden',
  },
  orb1: {
    position: 'fixed',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
    top: '-200px',
    right: '-100px',
    pointerEvents: 'none',
    zIndex: 0,
  },
  orb2: {
    position: 'fixed',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(96,165,250,0.04) 0%, transparent 70%)',
    bottom: '-100px',
    left: '-50px',
    pointerEvents: 'none',
    zIndex: 0,
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 var(--spacing-xl)',
    height: '64px',
    background: 'rgba(10,14,26,0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--color-border)',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' },
  logo: { fontSize: '1.5rem', color: 'var(--color-gold)' },
  logoText: {
    fontSize: 'var(--text-lg)',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.02em',
  },
  nav: { display: 'flex', alignItems: 'center', gap: 'var(--spacing-xl)' },
  navItem: {
    fontSize: 'var(--text-sm)',
    fontWeight: '500',
    color: 'var(--color-text-secondary)',
    transition: 'var(--transition-base)',
    letterSpacing: '0.01em',
  },
  headerRight: {},
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--color-gold-light), var(--color-gold))',
    color: 'var(--color-text-on-gold)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'var(--text-xs)',
    fontWeight: '700',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-gold)',
  },
  main: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '1280px',
    margin: '0 auto',
    padding: 'var(--spacing-xl) var(--spacing-xl) var(--spacing-xxl)',
  },
  hero: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: 'var(--spacing-xxl) 0 var(--spacing-xl)',
    gap: 'var(--spacing-xl)',
    flexWrap: 'wrap',
  },
  heroEyebrow: {
    fontSize: 'var(--text-sm)',
    fontWeight: '500',
    color: 'var(--color-gold)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 'var(--spacing-sm)',
  },
  heroTitle: {
    fontSize: 'var(--text-5xl)',
    fontWeight: '800',
    lineHeight: '1.1',
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.03em',
    marginBottom: 'var(--spacing-base)',
  },
  heroSubtitle: {
    fontSize: 'var(--text-base)',
    color: 'var(--color-text-secondary)',
    maxWidth: '400px',
    lineHeight: '1.6',
  },
  heroActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    flexShrink: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 'var(--spacing-base)',
    marginBottom: 'var(--spacing-xl)',
  },
  statCard: {
    padding: 'var(--spacing-lg)',
    cursor: 'default',
  },
  statHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 'var(--spacing-lg)',
  },
  statIcon: {
    fontSize: '1.4rem',
    color: 'var(--color-gold)',
    lineHeight: 1,
  },
  statValue: {
    fontSize: 'var(--text-3xl)',
    fontWeight: '800',
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.03em',
    marginBottom: 'var(--spacing-xs)',
    lineHeight: '1.1',
  },
  statLabel: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-muted)',
    fontWeight: '500',
    letterSpacing: '0.02em',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '340px 1fr',
    gap: 'var(--spacing-base)',
    alignItems: 'start',
  },
  chartCard: {
    padding: 'var(--spacing-lg)',
  },
  tableCard: {
    padding: 'var(--spacing-lg)',
  },
  cardHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 'var(--spacing-lg)',
  },
  cardTitle: {
    fontSize: 'var(--text-base)',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.01em',
  },
  donutPlaceholder: {
    display: 'flex',
    justifyContent: 'center',
    padding: 'var(--spacing-lg) 0',
  },
  donutRing: {
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    background: `conic-gradient(
      #C9A84C 0% 28%,
      #4E5A78 28% 50%,
      #E8C87A 50% 68%,
      #34D399 68% 83%,
      #60A5FA 83% 93%,
      #1E2740 93% 100%
    )`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-gold)',
    position: 'relative',
  },
  donutCenter: {
    width: '110px',
    height: '110px',
    borderRadius: '50%',
    background: 'var(--color-bg-secondary)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
    boxShadow: 'var(--shadow-inner)',
  },
  donutValue: {
    fontSize: 'var(--text-base)',
    fontWeight: '800',
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.03em',
  },
  donutLabel: {
    fontSize: '0.65rem',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  legend: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-sm)',
    marginTop: 'var(--spacing-base)',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
  },
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--color-gold)',
    flexShrink: 0,
  },
  legendName: {
    flex: 1,
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    fontFamily: 'var(--font-mono)',
  },
  legendPct: {
    fontSize: 'var(--text-sm)',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
  },
  tableWrapper: { display: 'flex', flexDirection: 'column', gap: '2px' },
  tableHead: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 2fr 1.2fr 1fr',
    padding: 'var(--spacing-xs) var(--spacing-sm)',
    borderRadius: 'var(--radius-md)',
  },
  th: {
    fontSize: '0.65rem',
    fontWeight: '600',
    color: 'var(--color-text-muted)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 2fr 1.2fr 1fr',
    padding: 'var(--spacing-sm)',
    borderRadius: 'var(--radius-md)',
    alignItems: 'center',
    transition: 'var(--transition-base)',
    cursor: 'default',
    borderBottom: '1px solid var(--color-border)',
  },
  tdAsset: {
    fontSize: 'var(--text-sm)',
    fontWeight: '500',
    color: 'var(--color-text-primary)',
  },
  tdTicker: {
    fontSize: 'var(--text-xs)',
    fontWeight: '600',
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-gold)',
    letterSpacing: '0.05em',
  },
  tdAlloc: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-secondary)',
  },
  allocBar: {
    height: '4px',
    width: '80px',
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-bg-overlay)',
    overflow: 'hidden',
  },
  allocFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--color-gold-light), var(--color-gold))',
    borderRadius: 'var(--radius-full)',
    maxWidth: '80px',
    transition: 'var(--transition-slow)',
  },
  tdValue: {
    fontSize: 'var(--text-sm)',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-mono)',
  },
  tdChange: {
    fontSize: 'var(--text-sm)',
    fontWeight: '600',
    fontFamily: 'var(--font-mono)',
  },
}

export default Dashboard
