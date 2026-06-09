import { COLORS } from '@/lib/constants'

export default function Card({
  children, title, subtitle, action,
  accent, padding = '1.4rem', className = '', style: extraStyle = {}
}) {
  return (
    <div style={{
      background: '#0D1F35',
      border: `1px solid ${accent ? accent + '33' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: accent ? `0 0 20px ${accent}18` : 'none',
      ...extraStyle
    }} className={`animate-fade-in ${className}`}>
      {(title || action) && (
        <div style={{
          padding: '0.9rem 1.2rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: accent ? `${accent}0A` : 'rgba(255,255,255,0.02)'
        }}>
          <div>
            {title && (
              <div style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '0.72rem',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: accent || COLORS.textSecondary
              }}>
                {title}
              </div>
            )}
            {subtitle && (
              <div style={{ fontSize: '0.75rem', color: COLORS.textMuted, marginTop: '0.15rem' }}>
                {subtitle}
              </div>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div style={{ padding }}>{children}</div>
    </div>
  )
}