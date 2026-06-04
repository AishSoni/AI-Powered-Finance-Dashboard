import type { CSSProperties, FC } from 'react'

// ── Mock transaction data ──────────────────────────────────────────────────────
export interface Transaction {
  id: string
  name: string
  category: 'tech' | 'lifestyle' | 'utilities' | 'food'
  date: string
  amount: number
  status: 'cleared' | 'pending' | 'flagged'
}

const categoryBadge: Record<Transaction['category'], { cls: string; label: string }> = {
  tech:       { cls: 'badge badge-tech',      label: 'Technology' },
  lifestyle:  { cls: 'badge badge-lifestyle', label: 'Lifestyle' },
  utilities:  { cls: 'badge badge-utilities', label: 'Utilities' },
  food:       { cls: 'badge badge-food',      label: 'Food' },
}

const statusColor: Record<Transaction['status'], string> = {
  cleared: 'var(--color-success)',
  pending: 'var(--color-warning-light)',
  flagged: 'var(--color-error)',
}

interface TransactionListProps {
  transactions: Transaction[]
  title?: string
}

const TransactionList: FC<TransactionListProps> = ({ transactions, title = 'Recent Transactions' }) => {
  return (
    <div className="card" style={s.wrapper}>
      <div style={s.header}>
        <span style={s.title}>{title}</span>
        <button className="btn-ghost" style={s.viewAll}>View all</button>
      </div>

      {/* Column headers */}
      <div style={s.colHeaders}>
        {['Merchant', 'Category', 'Date', 'Amount', 'Status'].map((h) => (
          <span key={h} style={s.colHeader}>{h}</span>
        ))}
      </div>

      <div style={s.divider} />

      {/* Rows */}
      {transactions.map((tx) => (
        <div key={tx.id} style={s.row}>
          <span style={s.merchant}>{tx.name}</span>
          <span>
            <span className={categoryBadge[tx.category].cls}>
              {categoryBadge[tx.category].label}
            </span>
          </span>
          <span style={s.date}>{tx.date}</span>
          <span style={{ ...s.amount, color: tx.amount < 0 ? 'var(--color-error)' : 'var(--color-success)' }}>
            {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toLocaleString()}
          </span>
          <span style={{ ...s.status, color: statusColor[tx.status] }}>
            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
          </span>
        </div>
      ))}
    </div>
  )
}

const s: Record<string, CSSProperties> = {
  wrapper: { padding: 'var(--space-5)' },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 'var(--space-4)',
  },
  title: {
    font: 'var(--font-heading-sm)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-primary)',
  },
  viewAll: { padding: '5px 12px', fontSize: '0.75rem' },
  colHeaders: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.4fr 1.2fr 1.2fr 1fr',
    padding: '0 var(--space-2)',
    gap: 'var(--space-3)',
  },
  colHeader: {
    font: 'var(--font-label-sm)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-tertiary)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  divider: {
    height: '1px',
    background: 'var(--color-border-subtle)',
    margin: 'var(--space-3) 0',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.4fr 1.2fr 1.2fr 1fr',
    padding: 'var(--space-3) var(--space-2)',
    borderRadius: 'var(--radius-sm)',
    alignItems: 'center',
    gap: 'var(--space-3)',
    transition: 'background 0.12s ease',
    cursor: 'default',
    borderBottom: '1px solid var(--color-border-subtle)',
  },
  merchant: {
    font: 'var(--font-body-md)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-primary)',
    fontWeight: 500,
  },
  date: {
    font: 'var(--font-body-sm)',
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-secondary)',
  },
  amount: {
    font: 'var(--font-heading-sm)',
    fontFamily: 'var(--font-family)',
    fontWeight: 600,
    letterSpacing: '-0.01em',
  },
  status: {
    font: 'var(--font-label-sm)',
    fontFamily: 'var(--font-family)',
    fontWeight: 600,
  },
}

export default TransactionList
