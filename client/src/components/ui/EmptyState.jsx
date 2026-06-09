import { COLORS } from '@/lib/constants'

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', textAlign: 'center', gap: '1rem' }}>
      {Icon && (
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={22} color={COLORS.textMuted} />
        </div>
      )}
      {title && <div style={{ fontWeight: 600, color: COLORS.textSecondary, fontSize: '0.95rem' }}>{title}</div>}
      {description && <div style={{ fontSize: '0.82rem', color: COLORS.textMuted, maxWidth: '280px', lineHeight: 1.6 }}>{description}</div>}
      {action && <div style={{ marginTop: '0.5rem' }}>{action}</div>}
    </div>
  )
}