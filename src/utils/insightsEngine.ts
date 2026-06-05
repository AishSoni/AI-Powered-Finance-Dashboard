/**
 * insightsEngine.ts — Proton Finance
 * ─────────────────────────────────────────────────────────────────────────────
 * Rule-based AI insights generator.
 *
 * Usage:
 *   import { generateInsights } from '@/utils/insightsEngine'
 *   const insights = generateInsights(transactions, budgetData)
 *
 * Rules (sorted by severity — critical first):
 *  1. CRITICAL   — Any category budget exceeded
 *  2. WARNING    — Entertainment category at > 85% of budget
 *  3. WARNING    — Subscription audit (> 2 subscriptions detected)
 *  4. INFO       — Dining anomaly (> 5 dining transactions / week avg)
 *  5. INFO       — Savings on track (savingsEfficiency > 90)
 */

import type { Transaction } from '@/components/Transactions/TransactionList'
import type { BudgetPageData } from '@/data/mockData'

// ─── Severity ordering ────────────────────────────────────────────────────────

export type InsightSeverity = 'critical' | 'warning' | 'info'

const SEVERITY_RANK: Record<InsightSeverity, number> = {
  critical: 0,
  warning:  1,
  info:     2,
}

// ─── Insight shape ────────────────────────────────────────────────────────────

export interface ProStrategyInsight {
  id:       string
  severity: InsightSeverity
  tag:      string
  title:    string
  body:     string
}

// ─── Subscription keywords ────────────────────────────────────────────────────

const SUBSCRIPTION_KEYWORDS = [
  'netflix', 'spotify', 'apple', 'hulu', 'disney', 'amazon prime',
  'youtube premium', 'adobe', 'microsoft 365', 'dropbox', 'notion',
  'figma', 'github', 'openai', 'chatgpt', 'claude', 'linear',
]

function isSubscription(name: string): boolean {
  const lower = name.toLowerCase()
  return SUBSCRIPTION_KEYWORDS.some((kw) => lower.includes(kw))
}

// ─── Dining keywords ─────────────────────────────────────────────────────────

const DINING_KEYWORDS = [
  'restaurant', 'cafe', 'coffee', 'food', 'dining', 'doordash',
  'ubereats', 'grubhub', 'seamless', 'chipotle', 'mcdonald', 'starbucks',
  'whole foods', 'trader joe', 'pizza', 'sushi', 'burger',
]

function isDining(tx: Transaction): boolean {
  const name = tx.name.toLowerCase()
  return (
    tx.category === 'food' ||
    DINING_KEYWORDS.some((kw) => name.includes(kw))
  )
}

// ─── Main engine ──────────────────────────────────────────────────────────────

/**
 * Generate up to 3 AI-style insights from transaction and budget data.
 *
 * @param transactions - Array of recent transactions
 * @param budget       - BudgetPageData with categories, savingsEfficiency, etc.
 * @returns Sorted list of at most 3 insights (critical → warning → info)
 */
export function generateInsights(
  transactions: Transaction[],
  budget: BudgetPageData,
): ProStrategyInsight[] {
  const insights: ProStrategyInsight[] = []

  // ── Rule 1: CRITICAL — category budget exceeded ───────────────────────────
  const exceeded = budget.categories.filter((c) => c.spent > c.limit)
  for (const cat of exceeded) {
    const overage = cat.spent - cat.limit
    insights.push({
      id:       `critical-exceeded-${cat.category.toLowerCase().replace(/\s+/g, '-')}`,
      severity: 'critical',
      tag:      'CRITICAL',
      title:    `${cat.category} budget exceeded`,
      body:     `You are $${overage.toFixed(0)} over your $${cat.limit} limit. Immediate reallocation recommended to avoid month-end shortfall.`,
    })
  }

  // ── Rule 2: WARNING — Entertainment > 85% of budget ──────────────────────
  const entertainment = budget.categories.find((c) =>
    c.category.toLowerCase().includes('entertainment'),
  )
  if (entertainment) {
    const pct = (entertainment.spent / entertainment.limit) * 100
    if (pct > 85 && entertainment.spent <= entertainment.limit) {
      insights.push({
        id:       'warning-entertainment-threshold',
        severity: 'warning',
        tag:      'Alert',
        title:    'Entertainment threshold approaching',
        body:     `Spending is at ${pct.toFixed(0)}% of your $${entertainment.limit} limit with days remaining. Consider reallocating from Travel or Discretionary.`,
      })
    }
  }

  // ── Rule 3: WARNING — Subscription audit (> 2 subscriptions) ─────────────
  const subscriptions = transactions.filter(
    (tx) => tx.amount < 0 && isSubscription(tx.name),
  )
  if (subscriptions.length > 2) {
    const totalMonthly = Math.abs(
      subscriptions.reduce((sum, tx) => sum + tx.amount, 0),
    )
    insights.push({
      id:       'warning-subscription-audit',
      severity: 'warning',
      tag:      'Subscription Audit',
      title:    `Cancel ${subscriptions.length} inactive services, save $${totalMonthly.toFixed(0)}/mo`,
      body:     `${subscriptions.map((t) => t.name).slice(0, 3).join(', ')} and ${Math.max(0, subscriptions.length - 3)} more subscriptions detected. Review and cancel unused ones.`,
    })
  }

  // ── Rule 4: INFO — Dining anomaly (> 5 dining transactions / week avg) ───
  const diningTxs = transactions.filter((tx) => tx.amount < 0 && isDining(tx))
  // Approximate weekly average: assume data covers 30 days → ~4.3 weeks
  const weeklyAvg = diningTxs.length / 4.3
  if (weeklyAvg > 5) {
    const aboveAvgPct = Math.round(((weeklyAvg - 5) / 5) * 100)
    insights.push({
      id:       'info-dining-anomaly',
      severity: 'info',
      tag:      'Dining Anomaly',
      title:    `Dining spending ${aboveAvgPct}% higher than average`,
      body:     `You averaged ${weeklyAvg.toFixed(1)} dining transactions per week this period. Cooking at home 2 extra nights could save ~$120/mo.`,
    })
  }

  // ── Rule 5: INFO — Savings on track (savingsEfficiency > 90) ─────────────
  if (budget.savingsEfficiency > 90) {
    const savedMorePct = (budget.savingsEfficiency - 90).toFixed(1)
    insights.push({
      id:       'info-savings-on-track',
      severity: 'info',
      tag:      'AI Insight',
      title:    `Savings on track: ${budget.savingsEfficiency}% efficiency`,
      body:     `You saved ${savedMorePct}% more than your baseline target last month. Reinvesting the surplus into your emergency fund would reach your 6-month goal by August.`,
    })
  }

  // ── Sort: critical → warning → info, then cap at 3 ───────────────────────
  return insights
    .sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity])
    .slice(0, 3)
}
