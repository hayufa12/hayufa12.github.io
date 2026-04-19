import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useStats() {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('stats')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        setStats(data ?? [])
        setLoading(false)
      })
  }, [])

  return { stats, loading }
}
