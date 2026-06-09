export function Skeleton({ width = '100%', height = '1rem', rounded = false, style: extra = {} }) {
  return (
    <div className="skeleton" style={{
      width,
      height,
      borderRadius: rounded ? '9999px' : '4px',
      ...extra
    }} />
  )
}

export function SkeletonCard() {
  return (
    <div style={{ background: '#0D1F35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <Skeleton width="40px" height="40px" rounded />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <Skeleton width="60%" height="0.85rem" />
          <Skeleton width="40%" height="0.72rem" />
        </div>
      </div>
      <Skeleton height="0.72rem" />
      <Skeleton width="80%" height="0.72rem" />
      <Skeleton width="50%" height="0.72rem" />
    </div>
  )
}