import { memo, useMemo, useState, type CSSProperties } from 'react'
import { Filter, Download, Receipt } from 'lucide-react'
import { useFetch, useLocalStorage, useAnalytics, ANALYTICS_EVENTS } from '@/hooks'
import { exportToCSV } from '@/utils/exportCSV'
import type { Transaction } from './TransactionList'
import { mockTransactions } from '@/data/mockData'

// ─── Constants ────────────────────────────────────────────────────────────────

type FilterKey = 'All' | 'Tech' | 'Food' | 'Lifestyle' | 'Utilities' | 'Bills' | 'Income'

const FILTER_PILLS: FilterKey[] = ['All', 'Tech', 'Food', 'Lifestyle', 'Utilities', 'Income']

const CATEGORY_TO_FILTER: Record<Transaction['category'], FilterKey> = {
  tech:       'Tech',
  food:       'Food',
  lifestyle:  'Lifestyle',
  utilities:  'Utilities',
}

// ─── Category config ──────────────────────────────────────────────────────────

interface CatConfig {
  bg:     string
  color:  string
  label:  string
  emoji:  string
  iconBg: string
}

const CAT_CONFIG: Record<Transaction['category'], CatConfig> = {
  tech: {
    bg:     'var(--color-badge-tech)',
    color:  '#5BA4FF',
    label:  'TECHNOLOGY',
    emoji:  '💻',
    iconBg: '#1A2A3E',
  },
  lifestyle: {
    bg:     'var(--color-badge-lifestyle)',
    color:  '#B57BFF',
    label:  'LIFESTYLE',
    emoji:  '🎬',
    iconBg: '#251A3E',
  },
  utilities: {
    bg:     'var(--color-badge-utilities)',
    color:  '#6DBF8A',
    label:  'UTILITIES',
    emoji:  '⚡',
    iconBg: '#1A2E25',
  },
  food: {
    bg:     'var(--color-badge-food)',
    color:  '#F5A623',
    label:  'FOOD',
    emoji:  '🛒',
    iconBg: '#2E2210',
  },
}

// ─── Status dot config ────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<Transaction['status'], { color: string; label: string }> = {
  cleared: { color: 'var(--color-success)',      label: 'CLEARED' },
  pending: { color: 'var(--color-warning-light)', label: 'PENDING' },
  flagged: { color: 'var(--color-error)',         label: 'FLAGGED' },
}

// ─── Mock fetcher (swap with real API) ────────────────────────────────────────

function fetchTransactions(): Promise<Transaction[]> {
  return new Promise((resolve) => setTimeout(() => resolve(mockTransactions), 600))
}

// ─── Row shimmer ─────────────────────────────────────────────────────────────

function RowSkeleton() {
  return (
    <div style={{ ...s.row, pointerEvents: 'none' }} aria-hidden="true">
      <div style={sk.merchant}>
        <div style={sk.icon} />
        <div style={sk.nameBlock}>
          <div style={sk.name} />
          <div style={sk.date} />
        </div>
      </div>
      <div style={sk.pill} />
      <div style={{ ...sk.pill, width: 60 }} />
      <div style={{ ...sk.name, width: 64, alignSelf: 'center' as const }} />
    </div>
  )
}

// ─── Transaction row (memoised) ───────────────────────────────────────────────

const TransactionRow = memo(function TransactionRow({ tx }: { tx: Transaction }) {
  const cat    = CAT_CONFIG[tx.category]
  const status = STATUS_CONFIG[tx.status]
  const isCredit = tx.amount > 0

  const fmtAmt = new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 2,
  })

  return (
    <div style={s.row} role="row">

      {/* Merchant */}
      <div style={s.merchantCell}>
        <div style={{ ...s.merchantIcon, background: cat.iconBg }}>
          <span style={{ fontSize: 16 }}>{cat.emoji}</span>
        </div>
        <div style={s.merchantInfo}>
          <span style={s.merchantName}>{tx.name}</span>
          <span style={s.merchantDate}>{tx.date}</span>
        </div>
      </div>

      {/* Category badge */}
      <div>
        <span style={{ ...s.catBadge, background: cat.bg, color: cat.color }}>
          {cat.label}
        </span>
      </div>

      {/* Status dot + label */}
      <div style={s.statusCell}>
        <span style={{ ...s.statusDot, background: status.color }} />
        <span style={{ ...s.statusText, color: status.color }}>{status.label}</span>
      </div>

      {/* Amount */}
      <div style={{ ...s.amount, color: isCredit ? 'var(--color-success)' : 'var(--color-error)' }}>
        {isCredit ? '+' : '-'}{fmtAmt.format(Math.abs(tx.amount))}
      </div>
    </div>
  )
})

// ─── RecentActivity ───────────────────────────────────────────────────────────

export default function RecentActivity() {
  const { data, loading } = useFetch<Transaction[]>(fetchTransactions)
  const { trackEvent }    = useAnalytics()

  const [activeFilter, setActiveFilter] = useLocalStorage<FilterKey>('tx-filter', 'All')
  const [hovered, setHovered]           = useState<string | null>(null)

  // Filter client-side; swap with server param when API is ready
  const filtered = useMemo(() => {
    if (!data) return []
    if (activeFilter === 'All') return data
    if (activeFilter === 'Income') return data.filter((tx) => tx.amount > 0)
    return data.filter(
      (tx) => CATEGORY_TO_FILTER[tx.category] === activeFilter,
    )
  }, [data, activeFilter])

  const handleFilter = (pill: FilterKey) => {
    setActiveFilter(pill)
    trackEvent(ANALYTICS_EVENTS.FILTER_CLICKED, {
      filter_name:  'tx-category',
      filter_value: pill,
    })
  }

  const handleExport = () => {
    trackEvent(ANALYTICS_EVENTS.EXPORT_CSV_CLICKED)
    exportToCSV(filtered.length > 0 ? filtered : (data ?? []), 'proton-transactions')
  }

  return (
    <section style={s.card} aria-label="Recent Activity">

      {/* ── Header ── */}
      <div style={s.header}>
        <h3 style={s.title}>Recent Activity</h3>
        <div style={s.headerActions}>
          <button
            id="export-csv-btn"
            style={s.actionBtn}
            onClick={handleExport}
            aria-label="Export transactions to CSV"
          >
            <Download size={14} strokeWidth={2} />
            <span>Export CSV</span>
          </button>
          <button style={s.actionBtn} aria-label="Open filter options">
            <Filter size={14} strokeWidth={2} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* ── Filter pills ── */}
      <div style={s.pills} role="group" aria-label="Filter transactions by category">
        {FILTER_PILLS.map((pill) => {
          const isActive = pill === activeFilter
          return (
            <button
              key={pill}
              id={`filter-${pill.toLowerCase()}`}
              style={isActive ? { ...s.pill, ...s.pillActive } : s.pill}
              onClick={() => handleFilter(pill)}
              aria-pressed={isActive}
            >
              {pill}
            </button>
          )
        })}
      </div>

      {/* ── Column headers ── */}
      <div style={s.colHeaders} role="row">
        {['MERCHANT', 'CATEGORY', 'STATUS', 'AMOUNT'].map((h) => (
          <span key={h} style={s.colHeader}>{h}</span>
        ))}
      </div>

      {/* ── Rows ── */}
      <div role="rowgroup">
        {/* Skeletons */}
        {loading && [0, 1, 2, 3].map((i) => <RowSkeleton key={i} />)}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div style={s.empty} aria-live="polite">
            <Receipt size={28} color="var(--color-text-tertiary)" strokeWidth={1.5} />
            <span style={s.emptyText}>No transactions found</span>
            <span style={s.emptyHint}>
              Try a different filter or check back later
            </span>
          </div>
        )}

        {/* Rows */}
        {!loading && filtered.map((tx) => (
          <div
            key={tx.id}
            style={hovered === tx.id ? { ...s.rowWrap, background: 'var(--color-bg-elevated)' } : s.rowWrap}
            onMouseEnter={() => setHovered(tx.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <TransactionRow tx={tx} />
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, CSSProperties> = {
  card: {
    background:   'var(--color-bg-surface)',
    border:       '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    overflow:     'hidden',
    display:      'flex',
    flexDirection:'column',
  },

  // Header
  header: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    padding:        '20px 20px 0',
  },
  title: {
    fontSize:   16,
    fontFamily: 'var(--font-family)',
    fontWeight:  700,
    color:      'var(--color-text-primary)',
    margin:       0,
  },
  headerActions: {
    display:    'flex',
    alignItems: 'center',
    gap:         8,
  },
  actionBtn: {
    display:    'flex',
    alignItems: 'center',
    gap:         6,
    padding:    '6px 12px',
    border:     '1px solid var(--color-border)',
    borderRadius:'var(--radius-md)',
    background: 'transparent',
    color:      'var(--color-text-secondary)',
    fontSize:    12,
    fontFamily: 'var(--font-family)',
    fontWeight:  500,
    cursor:     'pointer',
    transition: 'background 0.12s ease, color 0.12s ease',
  },

  // Pills
  pills: {
    display:    'flex',
    alignItems: 'center',
    gap:         6,
    padding:    '14px 20px 0',
    flexWrap:   'wrap',
  },
  pill: {
    padding:      '5px 13px',
    border:       '1px solid var(--color-border)',
    borderRadius:  99,
    background:   'transparent',
    color:        'var(--color-text-secondary)',
    fontSize:      12,
    fontFamily:   'var(--font-family)',
    fontWeight:    500,
    cursor:       'pointer',
    transition:   'all 0.12s ease',
    whiteSpace:   'nowrap',
  },
  pillActive: {
    background:  'var(--color-primary)',
    borderColor: 'var(--color-primary)',
    color:       '#FFFFFF',
    fontWeight:   600,
  },

  // Column headers
  colHeaders: {
    display:             'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    padding:             '14px 20px 10px',
    gap:                  8,
    borderBottom:        '1px solid var(--color-border-subtle)',
    marginTop:            8,
  },
  colHeader: {
    fontSize:      10,
    fontFamily:   'var(--font-family)',
    fontWeight:    600,
    color:        'var(--color-text-tertiary)',
    letterSpacing:'0.07em',
    textTransform:'uppercase',
  },

  // Row wrapper (for hover)
  rowWrap: {
    borderBottom: '1px solid var(--color-border-subtle)',
    transition:   'background 0.12s ease',
    cursor:       'default',
  },

  // Row grid
  row: {
    display:             'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    padding:             '14px 20px',
    alignItems:          'center',
    gap:                  8,
  },

  // Merchant cell
  merchantCell: {
    display:    'flex',
    alignItems: 'center',
    gap:         12,
    minWidth:    0,
  },
  merchantIcon: {
    width:          40,
    height:         40,
    borderRadius:    10,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:      0,
  },
  merchantInfo: {
    display:       'flex',
    flexDirection: 'column',
    gap:            3,
    minWidth:       0,
  },
  merchantName: {
    fontSize:    14,
    fontFamily: 'var(--font-family)',
    fontWeight:   600,
    color:       'var(--color-text-primary)',
    whiteSpace:  'nowrap',
    overflow:    'hidden',
    textOverflow:'ellipsis',
  },
  merchantDate: {
    fontSize:   12,
    fontFamily: 'var(--font-family)',
    color:      'var(--color-text-tertiary)',
  },

  // Category badge
  catBadge: {
    display:      'inline-flex',
    padding:      '3px 8px',
    borderRadius:  99,
    fontSize:       10,
    fontFamily:   'var(--font-family)',
    fontWeight:    600,
    letterSpacing:'0.06em',
    textTransform:'uppercase',
    whiteSpace:   'nowrap',
  },

  // Status
  statusCell: {
    display:    'flex',
    alignItems: 'center',
    gap:         6,
  },
  statusDot: {
    width:        6,
    height:       6,
    borderRadius: '50%',
    flexShrink:   0,
  },
  statusText: {
    fontSize:      10,
    fontFamily:   'var(--font-family)',
    fontWeight:    700,
    letterSpacing:'0.06em',
    textTransform:'uppercase',
  },

  // Amount
  amount: {
    fontSize:     14,
    fontFamily:  'var(--font-family)',
    fontWeight:   700,
    letterSpacing:'-0.01em',
    textAlign:   'right' as const,
  },

  // Empty
  empty: {
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    justifyContent: 'center',
    gap:             8,
    padding:        '40px 20px',
  },
  emptyText: {
    fontSize:   14,
    fontFamily: 'var(--font-family)',
    fontWeight:  600,
    color:      'var(--color-text-secondary)',
    marginTop:   4,
  },
  emptyHint: {
    fontSize:   12,
    fontFamily: 'var(--font-family)',
    color:      'var(--color-text-tertiary)',
  },
}

// Shimmer styles
const SHIMMER: CSSProperties = {
  background:     'linear-gradient(90deg, var(--color-bg-elevated) 25%, var(--color-bg-input) 50%, var(--color-bg-elevated) 75%)',
  backgroundSize: '200% 100%',
  animation:      'shimmer 1.4s ease infinite',
  borderRadius:    6,
}

const sk: Record<string, CSSProperties> = {
  merchant:  { display: 'flex', alignItems: 'center', gap: 12 },
  icon:      { ...SHIMMER, width: 40, height: 40, borderRadius: 10, flexShrink: 0 },
  nameBlock: { display: 'flex', flexDirection: 'column', gap: 6, flex: 1 },
  name:      { ...SHIMMER, height: 13, width: '65%' },
  date:      { ...SHIMMER, height: 10, width: '40%' },
  pill:      { ...SHIMMER, height: 22, width: 80, borderRadius: 99 },
}
