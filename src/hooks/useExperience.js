import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useExperience() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('experience')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        setJobs(data ?? [])
        setLoading(false)
      })
  }, [])

  return { jobs, loading }
}
