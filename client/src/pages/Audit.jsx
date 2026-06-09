import { useState, useEffect } from 'react'
import { Shield, Trash2, RefreshCw, Filter, Clock } from 'lucide-react'
import { getAudit, clearAudit } from '@/lib/api'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { timeAgo, formatDate } from '@/lib/utils'
import { COLORS, AGENT_COLORS } from '@/lib/constants'
import useWindowSize from '@/hooks/useWindowSize'
import useAppStore from '@/store/useAppStore'
import toast from 'react-hot-toast'

export default function Audit() {
  const { isMobile } = useWindowSize()
  const { auditLog: localLog } = useAppStore()
  const [serverLog, setServerLog] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [clearing, setClearing] = useState(false)

  const fetchAudit = async () => {
    try {
      setLoading(true)
      const res = await getAudit({ limit: 200 })
      setServerLog(res.data.data)
    } catch {
      setServerLog([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAudit() }, [])

  const handleClear = async () => {
    if (!confirm('Clear all server audit logs? This cannot be undone.')) return
    try {
      setClearing(true)
      await clearAudit()
      setServerLog([])
      toast.success('Audit log cleared')
    } catch {
      toast.error('Failed to clear audit log')
    } finally {
      setClearing(false)
    }
  }

  // Merge server and local logs
  const allLogs = [...localLog, ...serverLog].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  const filtered = filter === 'ALL' ? allLogs : allLogs.filter(e => e.agent === filter)

  const AGENTS = ['ALL', 'SCOUT', 'GUARDIAN', 'HUNTER', 'HUMAN']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

      {/* Header actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {AGENTS.map(a => {
            const agentStyle = AGENT_COLORS[a] || {}
            const active = filter === a
            return (
              <button
                key={a}
                onClick={() => setFilter(a)}
                style={{
                  padding: '0.4rem 0.85rem',
                  background: active ? (agentStyle.bg || 'rgba(193,123,47,0.15)') : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? (agentStyle.border || 'rgba(193,123,47,0.35)') : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '5px',
                  color: active ? (agentStyle.text || COLORS.gold) : COLORS.textMuted,
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: '0.68rem',
                  cursor: 'pointer',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {a}
              </button>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button onClick={fetchAudit} variant="ghost" size="sm" icon={RefreshCw}>Refresh</Button>
          <Button onClick={handleClear} variant="danger" size="sm" icon={Trash2} loading={clearing}>Clear</Button>
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 2 : 5}, 1fr)`, gap: '0.6rem' }}>
        {AGENTS.filter(a => a !== 'ALL').map(agent => {
          const count = allLogs.filter(e => e.agent === agent).length
          const style = AGENT_COLORS[agent] || {}
          return (
            <div key={agent} style={{ background: style.bg || '#0D1F35', border: `1px solid ${style.border || 'rgba(255,255,255,0.08)'}`, borderRadius: '6px', padding: '0.8rem', textAlign: 'center' }}>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: style.text || COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>{agent}</div>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: style.text || COLORS.textPrimary }}>{count}</div>
            </div>
          )
        })}
      </div>

      {/* Log table */}
      <Card title={`Audit Trail — ${filtered.length} entries`} action={
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', color: COLORS.textMuted }}>
          Immutable · DPA 2022 compliant
        </span>
      }>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {Array(8).fill(0).map((_, i) => <Skeleton key={i} height="52px" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Shield} title="No audit entries" description="Run the pipeline to generate audit log entries" />
        ) : (
          <div>
            {filtered.map((entry, idx) => {
              const agentStyle = AGENT_COLORS[entry.agent] || {}
              return (
                <div key={entry.id || idx} className="animate-fade-in" style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '110px 120px 1fr auto',
                  gap: '0.75rem',
                  alignItems: 'center',
                  padding: '0.85rem 0',
                  borderBottom: idx < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}>
                  {/* Agent badge */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: agentStyle.bg || 'rgba(255,255,255,0.05)',
                    border: `1px solid ${agentStyle.border || 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '4px',
                    padding: '0.25rem 0.6rem',
                    width: 'fit-content',
                  }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: agentStyle.dot || COLORS.textMuted, flexShrink: 0 }} />
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', color: agentStyle.text || COLORS.textMuted, letterSpacing: '0.1em' }}>
                      {entry.agent}
                    </span>
                  </div>

                  {/* Member */}
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: COLORS.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.memberName || entry.member || '—'}
                  </div>

                  {/* Note */}
                  <div style={{ fontSize: '0.8rem', color: COLORS.textMuted, lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {entry.note || entry.reason || entry.event || `${entry.agent} agent processed case`}
                    {entry.decision && <span style={{ marginLeft: '0.5rem' }}><Badge status={entry.decision} size="xs" /></span>}
                  </div>

                  {/* Time */}
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: COLORS.textMuted, textAlign: 'right', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={9} />
                    {timeAgo(entry.timestamp)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

    </div>
  )
}