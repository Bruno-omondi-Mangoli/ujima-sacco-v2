import { clsx } from 'clsx'

export const cn = (...inputs) => clsx(inputs)

export const formatKES = (amount) => {
  if (!amount && amount !== 0) return '—'
  if (amount >= 1_000_000) return `KES ${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `KES ${(amount / 1_000).toFixed(1)}K`
  return `KES ${amount.toLocaleString()}`
}

export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-KE', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

export const formatTime = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleTimeString('en-KE', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })
}

export const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export const getInitials = (name) => {
  if (!name) return '??'
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export const scoreColor = (score) => {
  if (score >= 80) return '#5CB88A'
  if (score >= 60) return '#E8A84A'
  return '#F87171'
}

export const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }