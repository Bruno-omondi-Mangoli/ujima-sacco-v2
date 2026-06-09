export const COLORS = {
  gold:   '#C17B2F',
  goldLight: '#E8A84A',
  green:  '#2E6E4E',
  greenLight: '#5CB88A',
  navy:   '#1A3A5C',
  navyLight: '#476CAB',
  purple: '#8B3A62',
  purpleLight: '#D476A8',
  danger: '#DC2626',
  dangerLight: '#F87171',
  surface: '#0D1F35',
  elevated: '#112440',
  border: 'rgba(255,255,255,0.08)',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
}

export const AGENT_COLORS = {
  SCOUT:    { bg: 'rgba(46,110,78,0.12)',    border: 'rgba(46,110,78,0.3)',    text: '#5CB88A',  dot: '#2E6E4E'  },
  GUARDIAN: { bg: 'rgba(193,123,47,0.12)',   border: 'rgba(193,123,47,0.3)',   text: '#E8A84A',  dot: '#C17B2F'  },
  HUNTER:   { bg: 'rgba(26,58,92,0.3)',      border: 'rgba(107,168,212,0.3)',  text: '#6BA8D4',  dot: '#1A3A5C'  },
  HUMAN:    { bg: 'rgba(139,58,98,0.12)',    border: 'rgba(139,58,98,0.3)',    text: '#D476A8',  dot: '#8B3A62'  },
}

export const STRESS_COLORS = {
  LOW:      { bg: 'rgba(46,110,78,0.15)',  border: 'rgba(46,110,78,0.3)',  text: '#5CB88A' },
  MEDIUM:   { bg: 'rgba(193,123,47,0.15)', border: 'rgba(193,123,47,0.3)', text: '#E8A84A' },
  HIGH:     { bg: 'rgba(220,38,38,0.15)',  border: 'rgba(220,38,38,0.3)',  text: '#F87171' },
  CRITICAL: { bg: 'rgba(185,28,28,0.2)',   border: 'rgba(185,28,28,0.4)',  text: '#FCA5A5' },
}

export const DECISION_COLORS = {
  AUTO_APPROVE:       { bg: 'rgba(46,110,78,0.15)',  text: '#5CB88A',  border: 'rgba(46,110,78,0.3)'  },
  ESCALATE_TO_HUNTER: { bg: 'rgba(107,168,212,0.15)', text: '#6BA8D4', border: 'rgba(107,168,212,0.3)' },
  AUTO_DENY:          { bg: 'rgba(220,38,38,0.15)',  text: '#F87171',  border: 'rgba(220,38,38,0.3)'  },
  APPROVED:           { bg: 'rgba(46,110,78,0.15)',  text: '#5CB88A',  border: 'rgba(46,110,78,0.3)'  },
  DENIED:             { bg: 'rgba(220,38,38,0.15)',  text: '#F87171',  border: 'rgba(220,38,38,0.3)'  },
  PENDING:            { bg: 'rgba(193,123,47,0.15)', text: '#E8A84A',  border: 'rgba(193,123,47,0.3)' },
}

export const NAV_ITEMS = [
  { path: '/',          label: 'Overview',   icon: 'LayoutDashboard' },
  { path: '/members',   label: 'Members',    icon: 'Users'           },
  { path: '/pipeline',  label: 'Pipeline',   icon: 'GitBranch'       },
  { path: '/analytics', label: 'Analytics',  icon: 'BarChart2'       },
  { path: '/audit',     label: 'Audit Trail',icon: 'Shield'          },
]