import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, GitBranch, BarChart2, Shield, ChevronLeft, Zap } from 'lucide-react'
import useAppStore from '@/store/useAppStore'
import useWindowSize from '@/hooks/useWindowSize'
import { COLORS } from '@/lib/constants'

const ICONS = { LayoutDashboard, Users, GitBranch, BarChart2, Shield }

const NAV = [
  { path: '/',          label: 'Overview',    icon: 'LayoutDashboard', color: COLORS.gold      },
  { path: '/members',   label: 'Members',     icon: 'Users',           color: COLORS.green     },
  { path: '/pipeline',  label: 'Pipeline',    icon: 'GitBranch',       color: COLORS.goldLight },
  { path: '/analytics', label: 'Analytics',   icon: 'BarChart2',       color: COLORS.navyLight },
  { path: '/audit',     label: 'Audit Trail', icon: 'Shield',          color: COLORS.purple    },
]

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore()
  const { isMobile } = useWindowSize()
  const location = useLocation()

  if (isMobile) return null

  const w = sidebarCollapsed ? '64px' : '220px'

  return (
    <aside style={{
      width: w,
      minHeight: '100vh',
      background: '#091422',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.25s ease',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>

      {/* Logo */}
      <div style={{ padding: sidebarCollapsed ? '1.2rem 0' : '1.2rem 1.2rem', display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', minHeight: '60px' }}>
        {!sidebarCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #C17B2F, #E8A84A)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Zap size={14} color="white" fill="white" />
            </div>
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: '0.95rem', lineHeight: 1 }}>Ujima</div>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.55rem', color: COLORS.textMuted, letterSpacing: '0.1em' }}>SACCO v2.0</div>
            </div>
          </div>
        )}
        {sidebarCollapsed && (
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #C17B2F, #E8A84A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={14} color="white" fill="white" />
          </div>
        )}
        <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.textMuted, padding: '0.25rem', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={14} style={{ transform: sidebarCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.75rem 0.6rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
        {NAV.map(item => {
          const Icon = ICONS[item.icon]
          const active = location.pathname === item.path
          return (
            <NavLink key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.7rem',
                padding: sidebarCollapsed ? '0.65rem 0' : '0.6rem 0.8rem',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                borderRadius: '6px',
                background: active ? `${item.color}15` : 'transparent',
                border: `1px solid ${active ? item.color + '25' : 'transparent'}`,
                transition: 'all 0.15s ease',
                cursor: 'pointer',
              }}>
                <Icon size={15} color={active ? item.color : COLORS.textMuted} />
                {!sidebarCollapsed && (
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.05em', color: active ? item.color : COLORS.textSecondary, fontWeight: active ? 600 : 400 }}>
                    {item.label}
                  </span>
                )}
              </div>
            </NavLink>
          )
        })}
      </nav>

      {/* Agent status */}
      {!sidebarCollapsed && (
        <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: COLORS.textMuted, marginBottom: '0.6rem' }}>
            Agent Status
          </div>
          {[
            { label: 'Scout',    color: COLORS.green     },
            { label: 'Guardian', color: COLORS.gold      },
            { label: 'Hunter',   color: '#6BA8D4'        },
          ].map(a => (
            <div key={a.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: a.color, boxShadow: `0 0 4px ${a.color}` }} className="animate-pulse-dot" />
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: COLORS.textMuted }}>{a.label}</span>
              <span style={{ marginLeft: 'auto', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.58rem', color: COLORS.greenLight }}>Online</span>
            </div>
          ))}
        </div>
      )}

    </aside>
  )
}