import { type CSSProperties } from 'react'

interface ChartSkeletonProps {
  height?: number
}

export const ChartSkeleton = ({ height = 200 }: ChartSkeletonProps) => {
  return (
    <div style={{ ...s.skeleton, height }} role="status" aria-label="Loading financial data">
      <div style={s.shimmer} />
    </div>
  )
}

const s: Record<string, CSSProperties> = {
  skeleton: {
    width: '100%',
    background: 'var(--color-bg-elevated)',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(90deg, var(--color-bg-elevated) 25%, var(--color-bg-input) 50%, var(--color-bg-elevated) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.4s ease infinite',
  },
}
