import { useState, useEffect } from 'react'
import { getMembers, getMember } from '@/lib/api'

export function useMembers(params) {
  const [members, setMembers]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const res = await getMembers(params)
      setMembers(res.data.data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMembers() }, [])

  return { members, loading, error, refetch: fetchMembers }
}

export function useMember(id) {
  const [member,  setMember]  = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!id) return
    getMember(id)
      .then(res => { setMember(res.data.data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [id])

  return { member, loading, error }
}