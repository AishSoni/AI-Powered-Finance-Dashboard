import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { type CSSProperties } from 'react'

interface SectorAllocationChartProps {
  data?: Array<{ name: string; value: number; color: string }>
}

const SectorAllocationChart = ({ data = defaultData }: SectorAllocationChartProps) => {
  const largestSector = data.reduce((max, item) => (item.value > max.value ? item : max), data[0])

  return (
    <div style={s.wrapper}>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center text */}
      <div style={s.centerText}>
        <div style={s.centerPercentage}>{largestSector.value}%</div>
        <div style={s.centerLabel}>{largestSector.name}</div>
      </div>

      {/* Legend */}
      <div style={s.legend}>
        {data.map((item) => (
          <div key={item.name} style={s.legendItem}>
            <div style={{ ...s.legendDot, background: item.color }} />
            <span style={s.legendName}>{item.name}</span>
            <span style={s.legendValue}>{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SectorAllocationChart

const defaultData = [
  { name: 'Technology', value: 42, color: '#0058BE' },
  { name: 'Financials', value: 28, color: '#F5A623' },
  { name: 'Healthcare', value: 18, color: '#00A86B' },
  { name: 'Other', value: 12, color: '#8B92A5' },
]

const s: Record<string, CSSProperties> = {
  wrapper: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  centerText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
  centerPercentage: {
    fontSize: 28,
    fontFamily: 'var(--font-family)',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    lineHeight: 1,
  },
  centerLabel: {
    fontSize: 11,
    fontFamily: 'var(--font-family)',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  legend: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginTop: 16,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    justifyContent: 'space-between',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
  },
  legendName: {
    fontSize: 12,
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-secondary)',
    flex: 1,
  },
  legendValue: {
    fontSize: 12,
    fontFamily: 'var(--font-family)',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
  },
}
