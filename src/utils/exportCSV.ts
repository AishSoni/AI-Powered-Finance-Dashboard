import type { Transaction } from '@/components/Transactions/TransactionList'

// ─── CSV builder ──────────────────────────────────────────────────────────────

const HEADERS = ['ID', 'Merchant', 'Category', 'Date', 'Amount (USD)', 'Status'] as const

function escapeCell(value: string | number): string {
  const str = String(value)
  return /[,"\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
}

function buildCSV(transactions: Transaction[]): string {
  const rows: string[] = [HEADERS.join(',')]

  for (const tx of transactions) {
    rows.push(
      [
        tx.id,
        tx.name,
        tx.category,
        tx.date,
        tx.amount.toFixed(2),
        tx.status,
      ]
        .map(escapeCell)
        .join(','),
    )
  }

  return rows.join('\r\n')
}

// ─── Download trigger ─────────────────────────────────────────────────────────

/**
 * Serialises `transactions` to RFC-4180 CSV and triggers a browser download.
 *
 * @param transactions - Array of transactions to export
 * @param filename     - Downloaded file name (`.csv` appended automatically if missing)
 *
 * @example
 * exportToCSV(mockTransactions, 'proton-june-2026')
 * // → triggers download of "proton-june-2026.csv"
 */
export function exportToCSV(transactions: Transaction[], filename: string): void {
  const name = filename.endsWith('.csv') ? filename : `${filename}.csv`
  const csv  = buildCSV(transactions)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)

  const anchor       = document.createElement('a')
  anchor.href        = url
  anchor.download    = name
  anchor.style.display = 'none'

  document.body.appendChild(anchor)
  anchor.click()

  setTimeout(() => {
    URL.revokeObjectURL(url)
    document.body.removeChild(anchor)
  }, 150)
}
