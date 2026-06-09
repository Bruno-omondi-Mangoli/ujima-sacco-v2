import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'
import { useAnalytics } from '@/hooks/useAnalytics'
import Card from '@/components/ui/Card'
import Stat from '@/components/ui/Stat'
import { SkeletonCard, Skeleton } from '@/components/ui/Skeleton'
import { formatKES } from '@/lib/utils'
import { COLORS } from '@/lib/constants'
import { TrendingUp, Users, Shield, GitBranch } from 'lucide-react'
import useWindowSize from '@/hooks/useWindowSize'

const CHART_COLORS = [COLORS.gold, COLORS.green, '#6BA8D4', COLORS.purple, COLORS.goldLight, COLORS.greenLight]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#112440', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '0.6rem 0.9rem' }}>
      {label && <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: COLORS.textMuted, marginBottom: '0.3rem' }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: p.color || COLORS.gold }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  )
}

export default function Analytics() {
  const { data, loading } = useAnalytics()
  const { isMobile } = useWindowSize()
  const overview = data?.overview || {}

  // Projected impact data
  const impactData = [
    { month: 'Month 1',  approvals: 32, denials: 68, baseline: 32 },
    { month: 'Month 3',  approvals: 45, denials: 55, baseline: 32 },
    { month: 'Month 6',  approvals: 55, denials: 45, baseline: 32 },
    { month: 'Month 9',  approvals: 62, denials: 38, baseline: 32 },
    { month: 'Month 12', approvals: 69, denials: 31, baseline: 32 },
    { month: 'Month 18', approvals: 69, denials: 31, baseline: 32 },
  ]

  const biasData = [
    { name: 'Gender Bias',     before: 22, after: 0  },
    { name: 'Occupation Bias', before: 46, after: 8  },
    { name: 'County Bias',     before: 39, after: 5  },
    { name: 'Season Bias',     before: 35, after: 4  },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '1rem' }}>
        {loading ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />) : (
          <>
            <Stat label="Total Members"     value={overview.totalMembers || 0}              icon={Users}      color={COLORS.gold}        />
            <Stat label="Credit Requested"  value={overview.totalCreditRequested || 0}       icon={TrendingUp} color={COLORS.green}       format="kes" />
            <Stat label="Female Members"    value={`${overview.femalePct || 0}%`}            icon={Shield}     color={COLORS.purple}      sub="of total pipeline" />
            <Stat label="Agent Decisions"   value={overview.agentDecisions || 0}             icon={GitBranch}  color="#6BA8D4"            />
          </>
        )}
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.2rem' }}>

        {/* Approval rate over time */}
        <Card title="Female Vendor Approval Rate" subtitle="Projected 18-month trajectory vs baseline">
          {loading ? <Skeleton height="200px" /> : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={impactData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fontFamily: 'IBM Plex Mono', fontSize: 10, fill: COLORS.textMuted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: 'IBM Plex Mono', fontSize: 10, fill: COLORS.textMuted }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontFamily: 'IBM Plex Mono', fontSize: '0.65rem' }} />
                <Line type="monotone" dataKey="approvals" name="AI-Assisted" stroke={COLORS.green} strokeWidth={2} dot={{ fill: COLORS.green, r: 3 }} />
                <Line type="monotone" dataKey="baseline"  name="Baseline"    stroke={COLORS.textMuted} strokeWidth={1} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Bias reduction */}
        <Card title="Bias Reduction After TRACK Audit" subtitle="Score point disparity before vs after remediation">
          {loading ? <Skeleton height="200px" /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={biasData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fontFamily: 'IBM Plex Mono', fontSize: 9, fill: COLORS.textMuted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: 'IBM Plex Mono', fontSize: 10, fill: COLORS.textMuted }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontFamily: 'IBM Plex Mono', fontSize: '0.65rem' }} />
                <Bar dataKey="before" name="Before (pts)" fill="rgba(220,38,38,0.6)"  radius={[3,3,0,0]} />
                <Bar dataKey="after"  name="After (pts)"  fill={COLORS.green}          radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.2rem' }}>

        {/* Members by occupation */}
        <Card title="Members by Occupation" subtitle="Current pipeline composition">
          {loading ? <Skeleton height="200px" /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data?.approvalsByOccupation || []} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fontFamily: 'IBM Plex Mono', fontSize: 9, fill: COLORS.textMuted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: 'IBM Plex Mono', fontSize: 10, fill: COLORS.textMuted }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Members" radius={[3,3,0,0]}>
                  {(data?.approvalsByOccupation || []).map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Agent activity */}
        <Card title="Agent Activity" subtitle="Decisions made per agent">
          {loading ? <Skeleton height="200px" /> : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data?.agentActivity?.filter(a => a.count > 0) || [{ name: 'No data', count: 1 }]}
                  dataKey="count"
                  nameKey="agent"
                  cx="50%" cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: COLORS.textMuted, strokeWidth: 0.5 }}
                >
                  {(data?.agentActivity || []).map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Impact metrics table */}
      <Card title="Projected 18-Month Impact" subtitle="Board-ready summary metrics">
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '1rem' }}>
          {[
            { label: 'Female vendor approvals',    before: '32%',      after: '69%',         delta: '+37%',    color: COLORS.green   },
            { label: 'Market vendor denial rate',  before: '68%',      after: '29%',         delta: '-39pp',   color: COLORS.green   },
            { label: 'Loan default rate',          before: '4.1%',     after: '<3.0%',       delta: '-1.1pp',  color: COLORS.green   },
            { label: 'New credit unlocked',        before: 'KES 0',    after: 'KES 2.1B',    delta: '+2.1B',   color: COLORS.gold    },
            { label: 'Officer hours saved/week',   before: '0 hrs',    after: '23 hrs',      delta: '+23hrs',  color: COLORS.gold    },
            { label: 'Child school terms (Yr 1)',  before: '0',        after: '4,200',       delta: '+4,200',  color: COLORS.purple  },
            { label: 'Gender score disparity',     before: '22 pts',   after: '0 pts',       delta: '-22pts',  color: COLORS.green   },
            { label: 'Data under African govern.', before: 'Unknown',  after: '100%',        delta: '+100%',   color: COLORS.gold    },
            { label: 'Member CSAT score',          before: '3.1 / 5',  after: '4.3 / 5',    delta: '+1.2pts', color: COLORS.gold    },
          ].map(metric => (
            <div key={metric.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '0.9rem 1rem' }}>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>
                {metric.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: COLORS.textMuted, marginBottom: '0.15rem' }}>Before</div>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.9rem', color: COLORS.textSecondary }}>{metric.before}</div>
                </div>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', color: metric.color, fontWeight: 700, padding: '0.2rem 0.5rem', background: `${metric.color}15`, borderRadius: '3px' }}>
                  {metric.delta}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: COLORS.textMuted, marginBottom: '0.15rem' }}>After</div>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.9rem', color: metric.color, fontWeight: 600 }}>{metric.after}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  )
}