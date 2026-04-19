import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('sort_order')
      .then(({ data }) => {
        setProjects(data ?? [])
        setLoading(false)
      })
  }, [])

  return { projects, loading }
}
