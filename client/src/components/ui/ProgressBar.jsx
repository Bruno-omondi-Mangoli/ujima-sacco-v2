import { scoreColor } from '@/lib/utils'

export default function ProgressBar({ value, max = 100, color, height = '6px', showLabel = false }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const barColor = color || scoreColor(pct)

  return (
    <div>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: '#64748B' }}>Score</span>
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: barColor, fontWeight: 600 }}>{value}%</span>
        </div>
      )}
      <div style={{ width: '100%', height, background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: '999px', transition: 'width 0.6s ease', boxShadow: `0 0 6px ${barColor}60` }} />
      </div>
    </div>
  )
}