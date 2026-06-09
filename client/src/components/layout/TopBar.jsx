import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, Search, Activity } from 'lucide-react'
import { COLORS, NAV_ITEMS } from '@/lib/constants'
import useWindowSize from '@/hooks/useWindowSize'

const PAGE_TITLES = {
  '/':          { title: 'Overview',    sub: 'System dashboard and key metrics'            },
  '/members':   { title: 'Members',     sub: 'Browse and manage SACCO members'             },
  '/pipeline':  { title: 'AI Pipeline', sub: 'Live agent loan processing workflow'          },
  '/analytics': { title: 'Analytics',   sub: 'Approval rates, bias metrics, impact data'   },
  '/audit':     { title: 'Audit Trail', sub: 'Immutable record of all agent decisions'      },
}

export default function TopBar() {
  const location = useLocation()
  const { isMobile } = useWindowSize()
  const page = PAGE_TITLES[location.pathname] || PAGE_TITLES['/']

  return (
    <header style={{
      height: '56px',
      background: '#091422',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      alignItems: 'center',
      padding: isMobile ? '0 1rem' : '0 1.5rem',
      justifyContent: 'space-between',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>

      {/* Page title */}
      <div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: isMobile ? '1rem' : '1.15rem', color: 'white', lineHeight: 1 }}>
          {page.title}
        </h1>
        {!isMobile && (
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: COLORS.textMuted, letterSpacing: '0.08em', marginTop: '0.15rem' }}>
            {page.sub}
          </p>
        )}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.6rem' : '1rem' }}>

        {/* Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(46,110,78,0.12)', border: '1px solid rgba(46,110,78,0.25)', borderRadius: '999px', padding: '0.3rem 0.7rem' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: COLORS.green }} className="animate-pulse-dot" />
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', color: COLORS.greenLight }}>
            {isMobile ? 'Live' : 'System Live'}
          </span>
        </div>

        {/* Time */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Activity size={11} color={COLORS.textMuted} />
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', color: COLORS.textMuted }}>
              {new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })} EAT
            </span>
          </div>
        )}

      </div>

    </header>
  )
}