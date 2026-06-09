import { STRESS_COLORS, DECISION_COLORS, AGENT_COLORS } from '@/lib/constants'

const BADGE_STYLES = {
  ...Object.fromEntries(
    Object.entries(STRESS_COLORS).map(([k, v]) => [k, v])
  ),
  ...Object.fromEntries(
    Object.entries(DECISION_COLORS).map(([k, v]) => [k, v])
  ),
  PASSED:  { bg: 'rgba(46,110,78,0.15)',  text: '#5CB88A', border: 'rgba(46,110,78,0.3)'  },
  FAILED:  { bg: 'rgba(220,38,38,0.15)',  text: '#F87171', border: 'rgba(220,38,38,0.3)'  },
  URGENT:  { bg: 'rgba(185,28,28,0.2)',   text: '#FCA5A5', border: 'rgba(185,28,28,0.4)'  },
  active:  { bg: 'rgba(46,110,78,0.15)',  text: '#5CB88A', border: 'rgba(46,110,78,0.3)'  },
  repaid:  { bg: 'rgba(107,168,212,0.15)',text: '#6BA8D4', border: 'rgba(107,168,212,0.3)' },
}

export default function Badge({ status, size = 'sm', className = '' }) {
  const style = BADGE_STYLES[status] || {
    bg: 'rgba(255,255,255,0.06)', text: '#94A3B8', border: 'rgba(255,255,255,0.1)'
  }

  const sizes = {
    xs: { fontSize: '0.6rem',  padding: '0.1rem 0.4rem'  },
    sm: { fontSize: '0.65rem', padding: '0.15rem 0.5rem' },
    md: { fontSize: '0.75rem', padding: '0.25rem 0.7rem' },
  }

  return (
    <span style={{
      background: style.bg,
      color: style.text,
      border: `1px solid ${style.border}`,
      borderRadius: '4px',
      fontFamily: 'IBM Plex Mono, monospace',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      display: 'inline-block',
      ...sizes[size]
    }} className={className}>
      {status?.replace(/_/g, ' ')}
    </span>
  )
}