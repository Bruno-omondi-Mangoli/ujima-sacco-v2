import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, GitBranch, Users, Filter } from 'lucide-react'
import { useMembers } from '@/hooks/useMembers'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { SkeletonCard } from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import ProgressBar from '@/components/ui/ProgressBar'
import { formatKES, getInitials, scoreColor } from '@/lib/utils'
import { COLORS } from '@/lib/constants'
import useWindowSize from '@/hooks/useWindowSize'
import useAppStore from '@/store/useAppStore'

export default function Members() {
  const { members, loading } = useMembers()
  const navigate = useNavigate()
  const { isMobile } = useWindowSize()
  const { setActiveMember } = useAppStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = members.filter(m => {
    const q = search.toLowerCase()
    const matchSearch = !q || m.name.toLowerCase().includes(q) || m.occupation.toLowerCase().includes(q) || m.location.toLowerCase().includes(q)
    const matchFilter = filter === 'all' || (filter === 'informal' && m.occupationCode.startsWith('INFORMAL')) || (filter === 'agri' && m.occupationCode.startsWith('AGRI'))
    return matchSearch && matchFilter
  })

  const handleProcess = (member) => {
    setActiveMember(member)
    navigate('/pipeline', { state: { member } })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

      {/* Search and filter bar */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={13} color={COLORS.textMuted} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search members, occupation, location..."
            style={{
              width: '100%',
              background: '#0D1F35',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              padding: '0.55rem 0.8rem 0.55rem 2.2rem',
              color: 'white',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '0.78rem',
              outline: 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {[
            { id: 'all',      label: 'All'      },
            { id: 'informal', label: 'Informal' },
            { id: 'agri',     label: 'Agri'     },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: '0.5rem 0.9rem',
                background: filter === f.id ? 'rgba(193,123,47,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${filter === f.id ? 'rgba(193,123,47,0.35)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '6px',
                color: filter === f.id ? COLORS.gold : COLORS.textMuted,
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '0.7rem',
                cursor: 'pointer',
                letterSpacing: '0.06em',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
        {[
          { label: 'Total Members',   value: members.length, color: COLORS.gold   },
          { label: 'Showing',         value: filtered.length, color: COLORS.green  },
          { label: 'Informal Traders',value: members.filter(m => m.occupationCode.startsWith('INFORMAL')).length, color: COLORS.goldLight },
        ].map(s => (
          <div key={s.label} style={{ background: '#0D1F35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '0.8rem 1rem' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>{s.label}</div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.3rem', fontWeight: 600, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Members grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '1rem' }}>
          {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState icon={Users} title="No members found" description="Try adjusting your search or filter" />
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '1rem' }}>
          {filtered.map(member => (
            <MemberCard key={member.id} member={member} onProcess={handleProcess} />
          ))}
        </div>
      )}
    </div>
  )
}

function MemberCard({ member, onProcess }) {
  const savingsRatio = Math.min(100, (member.savingsBalance / member.loanAmount) * 100)
  const historyScore = Math.min(100, member.saccoMonths * 2.5)

  return (
    <div style={{
      background: '#0D1F35',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '8px',
      overflow: 'hidden',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(193,123,47,0.25)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(193,123,47,0.06)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
    >

      {/* Card header */}
      <div style={{ padding: '1.1rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'flex-start', gap: '0.9rem' }}>
        <div style={{
          width: '42px', height: '42px',
          borderRadius: '10px',
          background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.gold}44)`,
          border: '1px solid rgba(193,123,47,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '0.8rem', fontWeight: 700,
          color: COLORS.gold, flexShrink: 0,
        }}>
          {getInitials(member.name)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'white', marginBottom: '0.2rem' }}>
            {member.name}
          </div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: COLORS.textMuted }}>
            {member.occupation} · {member.county}
          </div>
        </div>
        <Badge status={member.status} size="xs" />
      </div>

      {/* Card body */}
      <div style={{ padding: '1rem 1.2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

        {/* SMS preview */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '5px', padding: '0.65rem 0.8rem', borderLeft: `2px solid ${COLORS.gold}44` }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.58rem', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>Latest SMS</div>
          <div style={{ fontSize: '0.8rem', color: COLORS.textSecondary, fontStyle: 'italic', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            "{member.sms}"
          </div>
        </div>

        {/* Key data */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
          {[
            { label: 'Loan Request', value: formatKES(member.loanAmount),    color: COLORS.goldLight  },
            { label: 'Savings',      value: formatKES(member.savingsBalance), color: COLORS.greenLight },
            { label: 'SACCO History',value: `${member.saccoMonths}mo`,        color: '#6BA8D4'         },
          ].map(item => (
            <div key={item.label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', padding: '0.5rem 0.3rem' }}>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.55rem', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>{item.label}</div>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.78rem', color: item.color, fontWeight: 600 }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Progress bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: COLORS.textMuted }}>Savings ratio</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: COLORS.greenLight }}>{Math.round(savingsRatio)}%</span>
            </div>
            <ProgressBar value={savingsRatio} color={COLORS.green} height="4px" />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: COLORS.textMuted }}>SACCO history score</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: scoreColor(historyScore) }}>{Math.round(historyScore)}%</span>
            </div>
            <ProgressBar value={historyScore} height="4px" />
          </div>
        </div>

        {/* Children and harvest */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', color: COLORS.textMuted, background: 'rgba(255,255,255,0.04)', padding: '0.2rem 0.5rem', borderRadius: '3px' }}>
            {member.children === 0 ? 'No children' : `${member.children} child${member.children > 1 ? 'ren' : ''}`}
          </span>
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', color: COLORS.textMuted, background: 'rgba(255,255,255,0.04)', padding: '0.2rem 0.5rem', borderRadius: '3px' }}>
            Harvest: {member.harvest.split(' ').slice(0, 2).join(' ')}
          </span>
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', color: COLORS.textMuted, background: 'rgba(255,255,255,0.04)', padding: '0.2rem 0.5rem', borderRadius: '3px' }}>
            {member.defaultHistory === 0 ? '✓ Zero defaults' : `${member.defaultHistory} defaults`}
          </span>
        </div>

        {/* Action */}
        <Button onClick={() => onProcess(member)} variant="guardian" size="sm" icon={GitBranch} fullWidth>
          Process Through Pipeline
        </Button>
      </div>
    </div>
  )
}