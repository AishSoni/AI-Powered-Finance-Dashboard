import type { Transaction } from '@/components/Transactions/TransactionList'
import type { BudgetCategory } from '@/components/Budget/BudgetTracker'
import type { Alert } from '@/components/Cards/ActiveAlertsPreview'
import type { SpendingCategory } from '@/components/Spending/SpendingComposition'
import type { CategoryStatus } from '@/components/Budget/CategoryBudgetCard'

// ── Dashboard summary (fetched by MetricRow) ──────────────────────────────────

export interface DashboardSummary {
  netWorth:       number
  monthlySpending:number
  totalSavings:   number
}

export const dashboardSummary: DashboardSummary = {
  netWorth:        1248500,
  monthlySpending:  3870,
  totalSavings:     84240,
}

// ── Active alerts ─────────────────────────────────────────────────────────────

export const activeAlerts: Alert[] = [
  {
    id:       'alert-1',
    severity: 'warning',
    title:    'Entertainment budget at 87%',
    body:     '11 days remaining. Consider reallocating from Travel.',
    time:     '2 hours ago',
  },
  {
    id:       'alert-2',
    severity: 'error',
    title:    'Unusual transaction flagged',
    body:     'Stripe Inc. charge of $59 flagged for review.',
    time:     '5 hours ago',
  },
  {
    id:       'alert-3',
    severity: 'info',
    title:    'Portfolio rebalancing due',
    body:     'Tech allocation 4.2% above target. Review recommended.',
    time:     'Yesterday',
  },
]

// ── KPI Stats ─────────────────────────────────────────────────────────────────
export const kpiStats = [
  {
    id: 'aum',
    label: 'Total AUM',
    value: '$1,248,500',
    change: '3.2%',
    changeType: 'positive' as const,
    subLabel: 'vs last month',
  },
  {
    id: 'returns',
    label: 'YTD Returns',
    value: '+$84,240',
    change: '8.7%',
    changeType: 'positive' as const,
    subLabel: 'annualized',
  },
  {
    id: 'cashflow',
    label: 'Monthly Cash Flow',
    value: '+$4,280',
    change: '12.4%',
    changeType: 'positive' as const,
    subLabel: 'Jun 2026',
  },
  {
    id: 'risk',
    label: 'Portfolio Risk',
    value: '6.4 / 10',
    change: '0.3 pts',
    changeType: 'negative' as const,
    subLabel: 'Moderate',
  },
]

// ── AI Insights ───────────────────────────────────────────────────────────────
export const aiInsights = [
  {
    id: 'ai-1',
    tag: 'AI Insight',
    title: 'Rebalancing opportunity detected',
    body: 'Your tech allocation is 4.2% above target. Consider trimming NVDA and rotating into fixed income to reduce concentration risk.',
  },
  {
    id: 'ai-2',
    tag: 'Alert',
    title: 'Budget threshold approaching',
    body: 'Dining & Entertainment spending is at 87% of your June limit with 11 days remaining. Adjust or reallocate from Travel budget.',
  },
]

// ── Transactions ──────────────────────────────────────────────────────────────
export const mockTransactions: Transaction[] = [
  { id: 't1', name: 'Apple Inc.',         category: 'tech',      date: 'Jun 3, 2026',  amount: -1299,  status: 'cleared' },
  { id: 't2', name: 'Whole Foods Market', category: 'food',      date: 'Jun 3, 2026',  amount: -84,    status: 'cleared' },
  { id: 't3', name: 'Netflix',            category: 'lifestyle', date: 'Jun 2, 2026',  amount: -22,    status: 'cleared' },
  { id: 't4', name: 'Tesla Energy',       category: 'utilities', date: 'Jun 2, 2026',  amount: -145,   status: 'pending' },
  { id: 't5', name: 'Dividend — AAPL',   category: 'tech',      date: 'Jun 1, 2026',  amount: 418,    status: 'cleared' },
  { id: 't6', name: 'Stripe Inc.',        category: 'tech',      date: 'May 31, 2026', amount: -59,    status: 'flagged' },
]

// ── Budget categories ─────────────────────────────────────────────────────────
export const budgetCategories: BudgetCategory[] = [
  { name: 'Housing',          spent: 2400,  limit: 2500,  color: '#0058BE' },
  { name: 'Food & Dining',    spent: 780,   limit: 900,   color: '#00A86B' },
  { name: 'Transportation',   spent: 320,   limit: 400,   color: '#F5A623' },
  { name: 'Entertainment',    spent: 870,   limit: 600,   color: '#D93025' },
  { name: 'Utilities',        spent: 145,   limit: 250,   color: '#8B5CF6' },
]

// ── Portfolio allocation (for donut/chart) ────────────────────────────────────
export const portfolioAllocation = [
  { name: 'US Equities',   pct: 42, value: '$524,370', color: '#0058BE' },
  { name: 'International', pct: 18, value: '$224,730', color: '#00A86B' },
  { name: 'Fixed Income',  pct: 22, value: '$274,670', color: '#F5A623' },
  { name: 'Real Estate',   pct: 10, value: '$124,850', color: '#8B5CF6' },
  { name: 'Cash',          pct: 8,  value: '$99,880',  color: '#555E72' },
]

// ── Spending composition ───────────────────────────────────────────────────────
export const spendingCategories: SpendingCategory[] = [
  { label: 'Housing',      pct: 52, color: 'var(--color-primary)',  amount: 2400 },
  { label: 'Food & Dining',pct: 18, color: '#F5A623',               amount: 780  },
  { label: 'Investments',  pct: 16, color: 'var(--color-success)',  amount: 680  },
  { label: 'Transport',    pct: 8,  color: '#8B5CF6',               amount: 320  },
  { label: 'Utilities',    pct: 6,  color: '#555E72',               amount: 145  },
]

// ── Budget Page Data ─────────────────────────────────────────────────────────────

export interface BudgetCategoryExtended {
  category: string
  iconColor: string
  status: CategoryStatus
  spent: number
  limit: number
}

export interface BudgetPageData {
  fiscalPeriod: string
  totalSpent: number
  totalLimit: number
  daysRemaining: number
  projectedSurplus: number
  savingsEfficiency: number
  categories: BudgetCategoryExtended[]
}

export const budgetPageData: BudgetPageData = {
  fiscalPeriod: 'October 2023',
  totalSpent: 12450,
  totalLimit: 15000,
  daysRemaining: 10,
  projectedSurplus: 2550,
  savingsEfficiency: 94.2,
  categories: [
    { category: 'Housing', iconColor: '#0058BE', status: 'FIXED', spent: 2400, limit: 2500 },
    { category: 'Food & Dining', iconColor: '#00A86B', status: 'HEALTHY', spent: 642.50, limit: 900 },
    { category: 'Transportation', iconColor: '#F5A623', status: 'OPTIMAL', spent: 320, limit: 400 },
    { category: 'Entertainment', iconColor: '#D93025', status: 'CRITICAL', spent: 870, limit: 600 },
  ],
}

// Simulated async fetch function
export async function fetchBudget(): Promise<BudgetPageData> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return budgetPageData
}
