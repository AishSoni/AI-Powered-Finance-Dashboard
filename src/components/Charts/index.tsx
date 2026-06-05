import { lazy, Suspense } from 'react'
import { ChartSkeleton } from './ChartSkeleton'
import type { PortfolioSparklineProps } from './PortfolioSparkline'
import type { SectorAllocationChartProps } from './SectorAllocationChart'
import type { SpendingBarChartProps } from './SpendingBarChart'

const SpendingBarChart = lazy(() => import('./SpendingBarChart'))
const PortfolioSparkline = lazy(() => import('./PortfolioSparkline'))
const SectorAllocationChart = lazy(() => import('./SectorAllocationChart'))

export const LazySpendingBarChart = (props: SpendingBarChartProps) => (
  <Suspense fallback={<ChartSkeleton height={200} />}>
    <SpendingBarChart {...props} />
  </Suspense>
)

export const LazyPortfolioSparkline = (props: PortfolioSparklineProps) => (
  <Suspense fallback={<ChartSkeleton height={60} />}>
    <PortfolioSparkline {...props} />
  </Suspense>
)

export const LazySectorAllocationChart = (props: SectorAllocationChartProps) => (
  <Suspense fallback={<ChartSkeleton height={200} />}>
    <SectorAllocationChart {...props} />
  </Suspense>
)

export { ChartSkeleton } from './ChartSkeleton'
export type { PortfolioSparklineProps, SectorAllocationChartProps, SpendingBarChartProps }
