import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Something went wrong'
    if (error.response?.status !== 404) {
      toast.error(message)
    }
    return Promise.reject(error)
  }
)

// Members
export const getMembers = (params) => api.get('/api/members', { params })
export const getMember  = (id)     => api.get(`/api/members/${id}`)

// Agents
export const runScout    = (member)                           => api.post('/api/scout/analyse',   { member })
export const runGuardian = (member, scoutResult)              => api.post('/api/guardian/triage', { member, scoutResult })
export const runHunter   = (member, scoutResult, guardianResult) => api.post('/api/hunter/brief', { member, scoutResult, guardianResult })

// Audit
export const getAudit   = (params) => api.get('/api/audit', { params })
export const clearAudit = ()       => api.delete('/api/audit')

// Analytics
export const getAnalytics = () => api.get('/api/analytics')

// Health
export const getHealth = () => api.get('/api/health')

export default api