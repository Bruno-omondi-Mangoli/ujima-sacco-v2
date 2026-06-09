import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { GitBranch, ChevronRight, RotateCcw } from 'lucide-react'
import usePipelineStore from '@/store/usePipelineStore'
import useAppStore from '@/store/useAppStore'
import { useMembers } from '@/hooks/useMembers'
import { runScout, runGuardian, runHunter } from '@/lib/api'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import ProgressBar from '@/components/ui/ProgressBar'
import EmptyState from '@/components/ui/EmptyState'
import { formatKES, getInitials, scoreColor } from '@/lib/utils'
import { COLORS, AGENT_COLORS } from '@/lib/constants'
import useWindowSize from '@/hooks/useWindowSize'
import toast from 'react-hot-toast'

// ── Stage indicator ───────────────────────────────────────
function StageBar({ stage }) {
  const stages = [
    { id: 'SCOUT',    label: 'Scout',    color: COLORS.green  },
    { id: 'GUARDIAN', label: 'Guardian', color: COLORS.gold   },
    { id: 'HUNTER',   label: 'Hunter',   color: '#6BA8D4'     },
    { id: 'HUMAN',    label: 'Human',    color: COLORS.purple },
    { id: 'COMPLETE', label: 'Complete', color: COLORS.green  },
  ]
  const order = ['IDLE', 'SCOUT', 'GUARDIAN', 'HUNTER', 'HUMAN', 'COMPLETE']
  const currentIdx = order.indexOf(stage)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '1.5rem' }}>
      {stages.map((s, i) => {
        const stageIdx = order.indexOf(s.id)
        const done    = currentIdx > stageIdx
        const active  = currentIdx === stageIdx
        return (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', flex: i < stages.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{
                width: '30px', height: '30px',
                borderRadius: '50%',
                background: done || active ? s.color : 'rgba(255,255,255,0.06)',
                border: `2px solid ${done || active ? s.color : 'rgba(255,255,255,0.1)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem',
                color: done || active ? 'white' : COLORS.textMuted,
                fontFamily: 'IBM Plex Mono, monospace',
                fontWeight: 600,
                boxShadow: active ? `0 0 12px ${s.color}60` : 'none',
                transition: 'all 0.3s ease',
              }}>
                {done ? '✓' : i + 1}
              </div>
              <span style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '0.58rem',
                letterSpacing: '0.08em',
                color: done || active ? s.color : COLORS.textMuted,
                textTransform: 'uppercase',
              }}>
                {s.label}
              </span>
            </div>
            {i < stages.length - 1 && (
              <div style={{ flex: 1, height: '2px', background: done ? s.color : 'rgba(255,255,255,0.06)', margin: '0 0.3rem', marginBottom: '1.4rem', transition: 'background 0.3s ease' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Member selector ───────────────────────────────────────
function MemberSelector({ members, selected, onSelect }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {members.map((m, idx) => (
        <div
          key={m.id}
          onClick={() => onSelect(m)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            padding: '0.85rem 1rem',
            borderBottom: idx < members.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            cursor: 'pointer',
            background: selected?.id === m.id ? 'rgba(193,123,47,0.08)' : 'transparent',
            borderLeft: selected?.id === m.id ? `3px solid ${COLORS.gold}` : '3px solid transparent',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{
            width: '36px', height: '36px',
            borderRadius: '8px',
            background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.gold}44)`,
            border: `1px solid ${selected?.id === m.id ? 'rgba(193,123,47,0.4)' : 'rgba(255,255,255,0.08)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.7rem', fontWeight: 700,
            color: COLORS.gold, flexShrink: 0,
          }}>
            {getInitials(m.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {m.name}
            </div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', color: COLORS.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {m.occupation} · {formatKES(m.loanAmount)}
            </div>
          </div>
          {selected?.id === m.id && (
            <ChevronRight size={13} color={COLORS.gold} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Typing indicator ──────────────────────────────────────
function Typing({ color }) {
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '0.5rem 0' }}>
      {[0,1,2].map(i => (
        <div key={i} className="typing-dot" style={{
          width: '7px', height: '7px',
          borderRadius: '50%',
          background: color,
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
    </div>
  )
}

// ── Scout result panel ────────────────────────────────────
function ScoutResult({ result }) {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: COLORS.textMuted }}>STRESS LEVEL</span>
        <Badge status={result.stressLevel} />
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '5px', padding: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: COLORS.textMuted, width: '100%', marginBottom: '0.3rem' }}>KEYWORDS DETECTED</div>
        {result.keywordsDetected?.map((kw, i) => (
          <span key={i} style={{ background: 'rgba(220,38,38,0.15)', color: '#F87171', border: '1px solid rgba(220,38,38,0.25)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '3px' }}>
            {kw}
          </span>
        ))}
        {(!result.keywordsDetected || result.keywordsDetected.length === 0) && (
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: COLORS.textMuted }}>None detected</span>
        )}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '5px', padding: '0.75rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: COLORS.textMuted, marginBottom: '0.3rem' }}>HARVEST ALIGNMENT</div>
        <div style={{ fontSize: '0.82rem', color: COLORS.greenLight, lineHeight: 1.5 }}>{result.harvestAlignment}</div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '5px', padding: '0.75rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: COLORS.textMuted, marginBottom: '0.3rem' }}>MEMBER RESPONSE (SWAHILI)</div>
        <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', lineHeight: 1.6 }}>"{result.memberResponseSwahili}"</div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        padding: '0.75rem',
        background: result.escalateToGuardian ? 'rgba(193,123,47,0.08)' : 'rgba(46,110,78,0.08)',
        borderRadius: '5px',
        border: `1px solid ${result.escalateToGuardian ? 'rgba(193,123,47,0.25)' : 'rgba(46,110,78,0.25)'}`,
      }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: result.escalateToGuardian ? COLORS.gold : COLORS.green, flexShrink: 0 }} />
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem', color: result.escalateToGuardian ? COLORS.gold : COLORS.green }}>
          {result.escalateToGuardian ? `Escalating to Guardian — ${result.escalationPriority}` : 'No escalation needed'}
        </span>
      </div>
    </div>
  )
}

// ── Guardian result panel ─────────────────────────────────
function GuardianResult({ result }) {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
        {[
          { label: 'App Score',      value: `${result.applicationScore}%`,                          color: scoreColor(result.applicationScore) },
          { label: 'Counterfactual', value: `${result.counterfactualScore}%`,                       color: '#6BA8D4' },
          { label: 'Repayment/mo',   value: formatKES(result.repaymentCapacity),                   color: COLORS.greenLight },
          { label: 'Adj. Income',    value: formatKES(result.harvestAdjustedIncome),               color: COLORS.goldLight },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '5px', padding: '0.7rem', textAlign: 'center' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.58rem', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>{s.label}</div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.95rem', fontWeight: 600, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <ProgressBar value={result.applicationScore} showLabel height="8px" />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: COLORS.textMuted }}>BIAS CHECK</span>
        <Badge status={result.biasCheckPassed ? 'PASSED' : 'FAILED'} />
      </div>

      {result.riskFlags?.length > 0 && (
        <div style={{ background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '5px', padding: '0.75rem' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: '#F87171', marginBottom: '0.4rem' }}>RISK FLAGS</div>
          {result.riskFlags.map((flag, i) => (
            <div key={i} style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.2rem', display: 'flex', gap: '0.4rem' }}>
              <span style={{ color: '#F87171' }}>⚠</span>{flag}
            </div>
          ))}
        </div>
      )}

      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '5px', padding: '0.75rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: COLORS.textMuted, marginBottom: '0.3rem' }}>SUGGESTED REPAYMENT</div>
        <div style={{ fontSize: '0.82rem', color: COLORS.greenLight, lineHeight: 1.6 }}>{result.suggestedRepaymentSchedule}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(107,168,212,0.08)', border: '1px solid rgba(107,168,212,0.2)', borderRadius: '5px' }}>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem', color: '#6BA8D4' }}>Decision</span>
        <Badge status={result.decision} />
      </div>
    </div>
  )
}

// ── Hunter result panel ───────────────────────────────────
function HunterResult({ result }) {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(107,168,212,0.08)', border: '1px solid rgba(107,168,212,0.2)', borderRadius: '5px' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'white' }}>{result.assignedOfficer}</div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', color: COLORS.textMuted }}>{result.officerSpecialty}</div>
        </div>
        <Badge status={result.escalationPriority} />
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '5px', padding: '0.75rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: COLORS.textMuted, marginBottom: '0.5rem' }}>TOP 3 POINTS FOR OFFICER</div>
        {result.top3Points?.map((pt, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
            <span style={{ color: '#6BA8D4', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', flexShrink: 0, fontWeight: 600 }}>{i + 1}.</span>
            {pt}
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '5px', padding: '0.75rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: COLORS.textMuted, marginBottom: '0.5rem' }}>REPAYMENT SCHEDULE</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {result.repaymentSchedule?.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0.6rem', background: item.isSchoolFeeMonth ? 'rgba(220,38,38,0.08)' : 'rgba(255,255,255,0.03)', borderRadius: '3px', border: item.isSchoolFeeMonth ? '1px solid rgba(220,38,38,0.15)' : 'none' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem', color: COLORS.textMuted }}>{item.month}</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', color: COLORS.greenLight, fontWeight: 600 }}>{formatKES(item.amount)}</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: item.isSchoolFeeMonth ? '#F87171' : COLORS.textMuted }}>{item.note}</span>
            </div>
          ))}
        </div>
      </div>

      {result.crossSellOpportunities?.length > 0 && (
        <div style={{ background: 'rgba(46,110,78,0.07)', border: '1px solid rgba(46,110,78,0.2)', borderRadius: '5px', padding: '0.75rem' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: COLORS.greenLight, marginBottom: '0.4rem' }}>CROSS-SELL OPPORTUNITIES</div>
          {result.crossSellOpportunities.map((opp, i) => (
            <div key={i} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', marginBottom: '0.3rem', display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
              <span style={{ color: COLORS.green, marginTop: '0.1rem' }}>→</span>
              <div>
                <span style={{ color: COLORS.greenLight }}>{opp.product}</span>
                <span style={{ color: COLORS.textMuted }}> — {opp.reason}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: 'rgba(139,58,98,0.08)', border: '1px solid rgba(139,58,98,0.2)', borderRadius: '5px', padding: '0.75rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: COLORS.purpleLight, marginBottom: '0.3rem' }}>APPROVAL MESSAGE (SWAHILI)</div>
        <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', lineHeight: 1.6 }}>"{result.approvalMessageSwahili}"</div>
      </div>
    </div>
  )
}

// ── Human review panel ────────────────────────────────────
function HumanReview({ hunterResult, member, onDecision }) {
  const [note, setNote] = useState('')
  const [decided, setDecided] = useState(null)

  const decide = (d) => {
    setDecided(d)
    onDecision(d, note)
    toast.success(`Decision recorded: ${d}`)
  }

  if (decided) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{decided === 'APPROVED' ? '✓' : '✗'}</div>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.9rem', color: decided === 'APPROVED' ? COLORS.greenLight : '#F87171', marginBottom: '0.3rem', fontWeight: 600 }}>
          Loan {decided}
        </div>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: COLORS.textMuted, marginBottom: '1rem' }}>
          Decision logged to immutable audit trail
        </div>
        {note && (
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '5px', padding: '0.65rem', fontSize: '0.78rem', color: COLORS.textMuted, fontStyle: 'italic' }}>
            "{note}"
          </div>
        )}
        {decided === 'APPROVED' && hunterResult?.approvalMessageSwahili && (
          <div style={{ marginTop: '1rem', background: 'rgba(46,110,78,0.08)', border: '1px solid rgba(46,110,78,0.2)', borderRadius: '5px', padding: '0.75rem' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: COLORS.greenLight, marginBottom: '0.3rem' }}>SMS SENT TO MEMBER</div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', lineHeight: 1.6 }}>"{hunterResult.approvalMessageSwahili}"</div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ padding: '0.75rem', background: 'rgba(139,58,98,0.08)', border: '1px solid rgba(139,58,98,0.2)', borderRadius: '5px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
        {hunterResult?.briefingSummary || 'Review the complete briefing and make a final decision.'}
      </div>

      <div>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', color: COLORS.textMuted, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Officer Note (optional)
        </div>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Add a note for the audit trail..."
          style={{
            width: '100%', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '5px', padding: '0.6rem 0.8rem',
            color: 'white', fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.75rem', resize: 'none', height: '64px',
            outline: 'none', lineHeight: 1.5,
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <button
          onClick={() => decide('APPROVED')}
          style={{
            padding: '0.8rem', background: 'rgba(46,110,78,0.15)',
            border: '1px solid rgba(46,110,78,0.4)', borderRadius: '6px',
            color: COLORS.greenLight, cursor: 'pointer',
            fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.8rem',
            fontWeight: 600, letterSpacing: '0.08em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
            transition: 'all 0.15s ease',
          }}
        >
          ✓ APPROVE
        </button>
        <button
          onClick={() => decide('DENIED')}
          style={{
            padding: '0.8rem', background: 'rgba(220,38,38,0.1)',
            border: '1px solid rgba(220,38,38,0.3)', borderRadius: '6px',
            color: '#F87171', cursor: 'pointer',
            fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.8rem',
            fontWeight: 600, letterSpacing: '0.08em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
            transition: 'all 0.15s ease',
          }}
        >
          ✗ DENY
        </button>
      </div>
    </div>
  )
}

// ── Agent panel wrapper ───────────────────────────────────
function AgentPanel({ title, role, color, children, action, loading, empty }) {
  const agentStyle = { bg: `${color}12`, border: `${color}30` }
  return (
    <div style={{ background: '#0D1F35', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: '8px', overflow: 'hidden', boxShadow: loading ? `0 0 20px ${color}15` : 'none', transition: 'box-shadow 0.3s ease' }}>
      <div style={{ padding: '0.9rem 1.1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: `${color}0A` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, boxShadow: loading ? `0 0 8px ${color}` : `0 0 4px ${color}` }} className={loading ? 'animate-pulse-dot' : ''} />
          <div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color, fontWeight: 600 }}>{title}</div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.58rem', color: COLORS.textMuted }}>{role}</div>
          </div>
        </div>
        {action}
      </div>
      <div style={{ padding: '1.1rem' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', gap: '0.75rem' }}>
            <Typing color={color} />
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem', color: COLORS.textMuted }}>Agent processing...</span>
          </div>
        ) : empty ? (
          <div style={{ textAlign: 'center', padding: '1.5rem', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: COLORS.textMuted }}>
            {empty}
          </div>
        ) : children}
      </div>
    </div>
  )
}

// ── Main Pipeline page ────────────────────────────────────
export default function Pipeline() {
  const location = useLocation()
  const { isMobile } = useWindowSize()
  const { addAuditEntry } = useAppStore()
  const {
    member, setMember,
    scoutResult, setScoutResult,
    guardianResult, setGuardianResult,
    hunterResult, setHunterResult,
    setHumanDecision,
    loading, setLoading,
    stage, reset,
  } = usePipelineStore()

  const { members, loading: membersLoading } = useMembers()

  // Accept member passed from Members page
  useEffect(() => {
    if (location.state?.member) {
      setMember(location.state.member)
    }
  }, [location.state])

  const handleScout = async () => {
    if (!member) return toast.error('Select a member first')
    setLoading('scout', true)
    try {
      const res = await runScout(member)
      setScoutResult(res.data.data)
      addAuditEntry({ agent: 'SCOUT', memberName: member.name, event: 'SMS_ANALYSED', stressLevel: res.data.data.stressLevel, note: res.data.data.escalationReason })
      toast.success('Scout analysis complete')
    } catch {
      toast.error('Scout Agent failed')
    } finally {
      setLoading('scout', false)
    }
  }

  const handleGuardian = async () => {
    if (!scoutResult) return toast.error('Run Scout first')
    setLoading('guardian', true)
    try {
      const res = await runGuardian(member, scoutResult)
      setGuardianResult(res.data.data)
      addAuditEntry({ agent: 'GUARDIAN', memberName: member.name, event: 'LOAN_SCORED', decision: res.data.data.decision, score: res.data.data.applicationScore, note: res.data.data.decisionReason })
      toast.success('Guardian triage complete')
    } catch {
      toast.error('Guardian Agent failed')
    } finally {
      setLoading('guardian', false)
    }
  }

  const handleHunter = async () => {
    if (!guardianResult) return toast.error('Run Guardian first')
    setLoading('hunter', true)
    try {
      const res = await runHunter(member, scoutResult, guardianResult)
      setHunterResult(res.data.data)
      addAuditEntry({ agent: 'HUNTER', memberName: member.name, event: 'BRIEFING_PREPARED', note: `Assigned to ${res.data.data.assignedOfficer}` })
      toast.success('Hunter briefing ready')
    } catch {
      toast.error('Hunter Agent failed')
    } finally {
      setLoading('hunter', false)
    }
  }

  const handleHumanDecision = (decision, note) => {
    setHumanDecision({ decision, note })
    addAuditEntry({ agent: 'HUMAN', memberName: member.name, event: 'FINAL_DECISION', decision, note })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

      {/* Stage bar + reset */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <StageBar stage={stage} />
        </div>
        {stage !== 'IDLE' && (
          <Button onClick={reset} variant="ghost" size="sm" icon={RotateCcw} style={{ flexShrink: 0 }}>
            Reset
          </Button>
        )}
      </div>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '260px 1fr', gap: '1.2rem', alignItems: 'start' }}>

        {/* Member selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Card title="Member Queue" subtitle="Select to begin pipeline">
            {membersLoading ? (
              <div style={{ padding: '1rem', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: COLORS.textMuted }}>Loading...</div>
            ) : (
              <MemberSelector members={members} selected={member} onSelect={setMember} />
            )}
          </Card>

          {/* Active member info */}
          {member && (
            <Card accent={COLORS.gold} title="Active Case">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { label: 'Name',        value: member.name            },
                  { label: 'Occupation',  value: member.occupation      },
                  { label: 'Location',    value: member.location        },
                  { label: 'Loan',        value: formatKES(member.loanAmount) },
                  { label: 'Purpose',     value: member.loanPurpose     },
                  { label: 'Harvest',     value: member.harvest         },
                  { label: 'Children',    value: member.children === 0 ? 'None' : `${member.children} (ages ${member.childAges.join(', ')})` },
                  { label: 'SACCO',       value: `${member.saccoMonths} months, 0 defaults` },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem' }}>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', color: COLORS.textMuted, minWidth: '72px', flexShrink: 0, paddingTop: '0.1rem' }}>{item.label}</span>
                    <span style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{item.value}</span>
                  </div>
                ))}

                {/* SMS */}
                <div style={{ marginTop: '0.3rem', padding: '0.65rem', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', borderLeft: `2px solid ${COLORS.gold}44` }}>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.58rem', color: COLORS.textMuted, marginBottom: '0.2rem' }}>INCOMING SMS</div>
                  <div style={{ fontSize: '0.8rem', color: COLORS.textSecondary, fontStyle: 'italic', lineHeight: 1.5 }}>"{member.sms}"</div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Agent panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {!member ? (
            <Card>
              <EmptyState icon={GitBranch} title="No member selected" description="Select a member from the queue on the left to start the AI pipeline" />
            </Card>
          ) : (
            <>
              {/* Scout */}
              <AgentPanel
                title="Scout Agent"
                role="Financial Literacy Coach · Stress Detection"
                color={COLORS.green}
                loading={loading.scout}
                empty={!scoutResult && !loading.scout ? null : undefined}
                action={
                  !scoutResult && !loading.scout && (
                    <Button onClick={handleScout} variant="scout" size="sm">
                      ▶ Run Scout
                    </Button>
                  )
                }
              >
                {!scoutResult ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ fontSize: '0.85rem', color: COLORS.textMuted, fontStyle: 'italic' }}>
                      "{member.sms}"
                    </div>
                    <Button onClick={handleScout} variant="scout" size="sm">▶ Run Scout</Button>
                  </div>
                ) : (
                  <ScoutResult result={scoutResult} />
                )}
              </AgentPanel>

              {/* Guardian */}
              <AgentPanel
                title="Guardian Agent"
                role="Loan Triage · Bias Check · Harvest-Cycle Scoring"
                color={COLORS.gold}
                loading={loading.guardian}
                action={
                  scoutResult && !guardianResult && !loading.guardian && (
                    <Button onClick={handleGuardian} variant="guardian" size="sm">
                      ▶ Run Guardian
                    </Button>
                  )
                }
              >
                {!scoutResult ? (
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: COLORS.textMuted, padding: '0.5rem 0' }}>
                    Waiting for Scout Agent analysis...
                  </div>
                ) : !guardianResult ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: COLORS.greenLight }}>
                      ✓ Scout complete — ready for triage
                    </div>
                    <Button onClick={handleGuardian} variant="guardian" size="sm">▶ Run Guardian</Button>
                  </div>
                ) : (
                  <GuardianResult result={guardianResult} />
                )}
              </AgentPanel>

              {/* Hunter */}
              <AgentPanel
                title="Hunter Agent"
                role="Human-in-Loop Coordinator · Officer Briefing"
                color="#6BA8D4"
                loading={loading.hunter}
                action={
                  guardianResult && !hunterResult && !loading.hunter && (
                    <Button onClick={handleHunter} variant="hunter" size="sm">
                      ▶ Run Hunter
                    </Button>
                  )
                }
              >
                {!guardianResult ? (
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: COLORS.textMuted, padding: '0.5rem 0' }}>
                    Waiting for Guardian triage...
                  </div>
                ) : !hunterResult ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: COLORS.goldLight }}>
                      ✓ Guardian complete — ready for briefing
                    </div>
                    <Button onClick={handleHunter} variant="hunter" size="sm">▶ Run Hunter</Button>
                  </div>
                ) : (
                  <HunterResult result={hunterResult} />
                )}
              </AgentPanel>

              {/* Human Review */}
              <AgentPanel
                title="Human Review"
                role={`PRIDE Loop Pause Point · ${hunterResult?.assignedOfficer || 'Officer Assignment Pending'}`}
                color={COLORS.purple}
              >
                {!hunterResult ? (
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: COLORS.textMuted, padding: '0.5rem 0' }}>
                    Waiting for Hunter briefing packet...
                  </div>
                ) : (
                  <HumanReview hunterResult={hunterResult} member={member} onDecision={handleHumanDecision} />
                )}
              </AgentPanel>
            </>
          )}
        </div>
      </div>
    </div>
  )
}