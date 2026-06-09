import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, GitBranch, BarChart2, Shield } from 'lucide-react'
import { COLORS } from '@/lib/constants'
import useWindowSize from '@/hooks/useWindowSize'

const NAV = [
  { path: '/',          label: 'Home',     icon: LayoutDashboard, color: COLORS.gold      },
  { path: '/members',   label: 'Members',  icon: Users,           color: COLORS.green     },
  { path: '/pipeline',  label: 'Pipeline', icon: GitBranch,       color: COLORS.goldLight },
  { path: '/analytics', label: 'Charts',   icon: BarChart2,       color: COLORS.navyLight },
  { path: '/audit',     label: 'Audit',    icon: Shield,          color: COLORS.purple    },
]

export default function MobileNav() {
  const location = useLocation()
  const { isMobile } = useWindowSize()

  if (!isMobile) return null

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '60px',
      background: '#091422',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      zIndex: 100,
    }}>
      {NAV.map(item => {
        const Icon = item.icon
        const active = location.pathname === item.path
        return (
          <NavLink key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.2rem',
              borderTop: active ? `2px solid ${item.color}` : '2px solid transparent',
              transition: 'all 0.15s ease',
            }}>
              <Icon size={18} color={active ? item.color : COLORS.textMuted} />
              <span style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '0.55rem',
                letterSpacing: '0.06em',
                color: active ? item.color : COLORS.textMuted,
                fontWeight: active ? 600 : 400,
              }}>
                {item.label}
              </span>
            </div>
          </NavLink>
        )
      })}
    </nav>
  )
}