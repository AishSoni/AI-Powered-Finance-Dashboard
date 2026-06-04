import { memo } from 'react'
import { ActiveAlertsPreview, type Alert } from '@/components/Cards/ActiveAlertsPreview'

interface AlertsPanelProps {
  alerts?: Alert[]
  loading?: boolean
}

export const AlertsPanel = memo(function AlertsPanel({ alerts, loading }: AlertsPanelProps) {
  return <ActiveAlertsPreview alerts={alerts} loading={loading} compact={false} />
})
