import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('profile')
      .select('*')
      .single()
      .then(({ data }) => {
        setProfile(data)
        setLoading(false)
      })
  }, [])

  return { profile, loading }
}
