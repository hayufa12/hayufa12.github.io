import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useSkills() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('skills')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        setSkills(data ?? [])
        setLoading(false)
      })
  }, [])

  const groups = skills.reduce((acc, skill) => {
    const existing = acc.find(g => g.category === skill.category)
    if (existing) {
      existing.skills.push(skill)
    } else {
      acc.push({ category: skill.category, skills: [skill] })
    }
    return acc
  }, [])

  return { groups, loading }
}
