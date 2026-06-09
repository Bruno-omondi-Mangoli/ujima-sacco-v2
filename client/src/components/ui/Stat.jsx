import { COLORS } from '@/lib/constants'
import { formatKES } from '@/lib/utils'

export default function Stat({ label, value, sub, color, icon: Icon, format }) {
  const displayValue = format === 'kes' ? formatKES(value) : value

  return (
    <div style={{
      background: '#0D1F35',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '8px',
      padding: '1.2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: COLORS.textMuted }}>
          {label}
        </span>
        {Icon && (
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: `${color || COLORS.gold}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={13} color={color || COLORS.gold} />
          </div>
        )}
      </div>
      <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.5rem', fontWeight: 600, color: color || COLORS.textPrimary, lineHeight: 1 }}>
        {displayValue}
      </div>
      {sub && (
        <div style={{ fontSize: '0.75rem', color: COLORS.textMuted }}>
          {sub}
        </div>
      )}
    </div>
  )
}