// src/hooks/useLeads.js
import { useState, useEffect, useMemo } from 'react'
import { subscribeLeads } from '../lib/firestore'

export function useLeads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeLeads((data) => {
      setLeads(data)
      setLoading(false)
    })
    return unsub
  }, [])

  return { leads, loading }
}

export function useFilteredLeads(leads, filters) {
  return useMemo(() => {
    let result = [...leads]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (l) =>
          l.name?.toLowerCase().includes(q) ||
          l.company?.toLowerCase().includes(q) ||
          l.email?.toLowerCase().includes(q)
      )
    }
    if (filters.status) {
      result = result.filter((l) => l.status === filters.status)
    }
    if (filters.source) {
      result = result.filter((l) => l.source === filters.source)
    }
    if (filters.assignedTo) {
      result = result.filter((l) => l.assignedTo === filters.assignedTo)
    }

    return result
  }, [leads, filters])
}
