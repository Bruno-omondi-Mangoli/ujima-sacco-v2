import { useState, useEffect } from 'react'
import { getAnalytics } from '@/lib/api'

export function useAnalytics() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetch = async () => {
    try {
      setLoading(true)
      const res = await getAnalytics()
      setData(res.data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  return { data, loading, error, refetch: fetch }
}