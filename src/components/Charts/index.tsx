import { lazy, Suspense } from 'react'
import { ChartSkeleton } from './ChartSkeleton'

// Lazy-loaded chart components
const SpendingBarChart = lazy(() => import('./SpendingBarChart'))
const PortfolioSparkline = lazy(() => import('./PortfolioSparkline'))
const SectorAllocationChart = lazy(() => import('./SectorAllocationChart'))

// Wrapper components with Suspense fallback
export const LazySpendingBarChart = (props: any) => (
  <Suspense fallback={<ChartSkeleton height={200} />}>
    <SpendingBarChart {...props} />
  </Suspense>
)

export const LazyPortfolioSparkline = (props: any) => (
  <Suspense fallback={<ChartSkeleton height={60} />}>
    <PortfolioSparkline {...props} />
  </Suspense>
)

export const LazySectorAllocationChart = (props: any) => (
  <Suspense fallback={<ChartSkeleton height={200} />}>
    <SectorAllocationChart {...props} />
  </Suspense>
)

// Direct exports for non-lazy usage
export { default as SpendingBarChart } from './SpendingBarChart'
export { default as PortfolioSparkline } from './PortfolioSparkline'
export { default as SectorAllocationChart } from './SectorAllocationChart'
export { ChartSkeleton } from './ChartSkeleton'
