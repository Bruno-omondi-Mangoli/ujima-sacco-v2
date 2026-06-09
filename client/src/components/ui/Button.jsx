import { COLORS } from '@/lib/constants'

const VARIANTS = {
  primary: {
    background: COLORS.gold,
    color: 'white',
    border: 'none',
    hover: COLORS.goldLight,
  },
  secondary: {
    background: 'rgba(255,255,255,0.06)',
    color: COLORS.textSecondary,
    border: '1px solid rgba(255,255,255,0.1)',
    hover: 'rgba(255,255,255,0.1)',
  },
  ghost: {
    background: 'transparent',
    color: COLORS.textSecondary,
    border: '1px solid rgba(255,255,255,0.08)',
    hover: 'rgba(255,255,255,0.06)',
  },
  danger: {
    background: 'rgba(220,38,38,0.12)',
    color: '#F87171',
    border: '1px solid rgba(220,38,38,0.3)',
    hover: 'rgba(220,38,38,0.2)',
  },
  scout: {
    background: 'rgba(46,110,78,0.15)',
    color: '#5CB88A',
    border: '1px solid rgba(46,110,78,0.35)',
    hover: 'rgba(46,110,78,0.25)',
  },
  guardian: {
    background: COLORS.gold,
    color: 'white',
    border: 'none',
    hover: COLORS.goldLight,
  },
  hunter: {
    background: 'rgba(26,58,92,0.4)',
    color: '#6BA8D4',
    border: '1px solid rgba(107,168,212,0.35)',
    hover: 'rgba(107,168,212,0.15)',
  },
}

const SIZES = {
  sm: { padding: '0.35rem 0.8rem',  fontSize: '0.72rem' },
  md: { padding: '0.5rem 1.1rem',   fontSize: '0.8rem'  },
  lg: { padding: '0.65rem 1.4rem',  fontSize: '0.88rem' },
}

export default function Button({
  children, onClick, variant = 'primary', size = 'md',
  disabled = false, loading = false, icon: Icon, fullWidth = false,
  style: extraStyle = {}
}) {
  const v = VARIANTS[variant] || VARIANTS.primary
  const s = SIZES[size] || SIZES.md

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.45rem',
        background: v.background,
        color: v.color,
        border: v.border || 'none',
        borderRadius: '5px',
        fontFamily: 'IBM Plex Mono, monospace',
        letterSpacing: '0.06em',
        fontWeight: 500,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'all 0.15s ease',
        width: fullWidth ? '100%' : 'auto',
        flexShrink: 0,
        ...s,
        ...extraStyle,
      }}
    >
      {loading ? (
        <span style={{
          width: '12px', height: '12px',
          border: '2px solid currentColor',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          display: 'inline-block',
        }} className="animate-spin" />
      ) : Icon ? (
        <Icon size={13} />
      ) : null}
      {children}
    </button>
  )
}