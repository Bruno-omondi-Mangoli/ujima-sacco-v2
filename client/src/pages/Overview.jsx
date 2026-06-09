import { useNavigate } from 'react-router-dom'
import { Users, TrendingUp, Shield, GitBranch, ArrowRight, CheckCircle, AlertTriangle, Clock } from 'lucide-react'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useMembers } from '@/hooks/useMembers'
import Stat from '@/components/ui/Stat'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { SkeletonCard, Skeleton } from '@/components/ui/Skeleton'
import { formatKES, formatDate, timeAgo, getInitials } from '@/lib/utils'
import { COLORS, AGENT_COLORS } from '@/lib/constants'
import useWindowSize from '@/hooks/useWindowSize'

export default function Overview() {
  const { data, loading: analyticsLoading } = useAnalytics()
  const { members, loading: membersLoading } = useMembers()
  const navigate = useNavigate()
  const { isMobile } = useWindowSize()

  const overview = data?.overview || {}

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0D1F35 0%, #112440 50%, #152B4A 100%)',
        border: '1px solid rgba(193,123,47,0.2)',
        borderRadius: '10px',
        padding: isMobile ? '1.2rem' : '1.8rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(193,123,47,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: '0.5rem' }}>
            PLP AI Safari Capstone · Phase 4 · Agent Savannah
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: isMobile ? '1.4rem' : '1.9rem', color: 'white', marginBottom: '0.5rem', lineHeight: 1.2 }}>
            Ujima SACCO AI Agent Dashboard
          </h2>
          <p style={{ fontSize: '0.88rem', color: COLORS.textSecondary, maxWidth: '540px', lineHeight: 1.7, marginBottom: '1.2rem' }}>
            Three AI agents — Scout, Guardian, and Hunter — working in synchronized ambush to process loan applications for 14,000 informal traders across Kenya and Uganda.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button onClick={() => navigate('/pipeline')} icon={GitBranch} size="md">
              Open Pipeline
            </Button>
            <Button onClick={() => navigate('/members')} variant="ghost" icon={Users} size="md">
              View Members
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '1rem' }}>
        {analyticsLoading ? (
          Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <Stat label="Total Members"       value={overview.totalMembers || 0}           icon={Users}      color={COLORS.gold}   />
            <Stat label="Credit Requested"    value={overview.totalCreditRequested || 0}    icon={TrendingUp} color={COLORS.green}   format="kes" />
            <Stat label="Informal Traders"    value={`${overview.informalPct || 0}%`}       icon={Shield}     color={COLORS.goldLight} sub={`${overview.informalTraders || 0} of ${overview.totalMembers || 0} members`} />
            <Stat label="Female Members"      value={`${overview.femalePct || 0}%`}         icon={Users}      color={COLORS.purple}  sub={`${overview.femaleMembers || 0} women in pipeline`} />
          </>
        )}
      </div>

      {/* Main content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 340px', gap: '1.5rem' }}>

        {/* Left — Recent members */}
        <Card
          title="Member Queue"
          subtitle="Latest applications pending pipeline processing"
          action={<Button onClick={() => navigate('/members')} variant="ghost" size="sm" icon={ArrowRight}>View all</Button>}
        >
          {membersLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Array(4).fill(0).map((_, i) => <Skeleton key={i} height="64px" />)}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {members.slice(0, 5).map((member, idx) => (
                <div
                  key={member.id}
                  onClick={() => navigate('/pipeline', { state: { member } })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.9rem',
                    padding: '0.85rem 0',
                    borderBottom: idx < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '38px', height: '38px',
                    borderRadius: '8px',
                    background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.gold}44)`,
                    border: '1px solid rgba(193,123,47,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: '0.72rem', fontWeight: 600,
                    color: COLORS.gold, flexShrink: 0,
                  }}>
                    {getInitials(member.name)}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'white', marginBottom: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {member.name}
                    </div>
                    <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: COLORS.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {member.occupation} · {member.location.split(',')[0]}
                    </div>
                  </div>

                  {/* Amount */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.78rem', color: COLORS.goldLight, fontWeight: 500 }}>
                      {formatKES(member.loanAmount)}
                    </div>
                    <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: COLORS.textMuted }}>
                      {member.saccoMonths}mo history
                    </div>
                  </div>

                  <ArrowRight size={13} color={COLORS.textMuted} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Agent status */}
          <Card title="Agent Status" accent={COLORS.green}>
            {[
              { name: 'Scout Agent',    role: 'Financial Literacy Coach', color: COLORS.green,     status: 'Online', decisions: data?.agentActivity?.find(a => a.agent === 'SCOUT')?.count || 0 },
              { name: 'Guardian Agent', role: 'Loan Triage Officer',       color: COLORS.gold,      status: 'Online', decisions: data?.agentActivity?.find(a => a.agent === 'GUARDIAN')?.count || 0 },
              { name: 'Hunter Agent',   role: 'Human-in-Loop Coordinator', color: '#6BA8D4',        status: 'Online', decisions: data?.agentActivity?.find(a => a.agent === 'HUNTER')?.count || 0 },
            ].map(agent => (
              <div key={agent.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: agent.color, boxShadow: `0 0 5px ${agent.color}`, flexShrink: 0 }} className="animate-pulse-dot" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: agent.color, fontWeight: 500 }}>{agent.name}</div>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: COLORS.textMuted }}>{agent.role}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: COLORS.greenLight }}>● {agent.status}</div>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: COLORS.textMuted }}>{agent.decisions} decisions</div>
                </div>
              </div>
            ))}
          </Card>

          {/* Key metrics */}
          <Card title="Impact Metrics" accent={COLORS.gold}>
            {[
              { label: 'Avg Loan Amount',    value: formatKES(overview.avgLoanAmount),             color: COLORS.goldLight  },
              { label: 'Total Savings Pool', value: formatKES(overview.totalSavings),              color: COLORS.greenLight },
              { label: 'Agent Decisions',    value: overview.agentDecisions || 0,                  color: '#6BA8D4'         },
              { label: 'Human Reviews',      value: overview.humanDecisions || 0,                  color: COLORS.purpleLight},
            ].map(metric => (
              <div key={metric.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: COLORS.textMuted }}>{metric.label}</span>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.78rem', color: metric.color, fontWeight: 600 }}>{metric.value}</span>
              </div>
            ))}
          </Card>

          {/* GUARD rails status */}
          <Card title="GUARD Safety Rails" accent={COLORS.green}>
            {[
              { label: 'Gender proxy block',          status: 'Active'   },
              { label: 'Bias check on all denials',   status: 'Active'   },
              { label: 'Dignity language filter',     status: 'Active'   },
              { label: 'Busia County K-flag',         status: 'Active'   },
              { label: 'DPA 2022 data sovereignty',   status: 'Compliant'},
            ].map(rail => (
              <div key={rail.label} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <CheckCircle size={12} color={COLORS.greenLight} />
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: COLORS.textSecondary, flex: 1 }}>{rail.label}</span>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: COLORS.greenLight }}>{rail.status}</span>
              </div>
            ))}
          </Card>

        </div>
      </div>
    </div>
  )
}