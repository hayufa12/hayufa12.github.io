import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function ProtectedProjectRoute({ children }) {
  const { id } = useParams()
  const { user, loading } = useAuth()
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    if (loading) return
    if (!user) { setStatus('unauthenticated'); return }

    supabase
      .from('access_requests')
      .select('status')
      .eq('user_id', user.id)
      .eq('project_id', id)
      .single()
      .then(({ data }) => {
        setStatus(data?.status ?? 'none')
      })
  }, [user, loading, id])

  if (loading || status === 'checking') return null
  if (status === 'unauthenticated') return <Navigate to="/login" replace state={{ projectId: id }} />
  if (status === 'approved') return children
  return <Navigate to="/projects" replace state={{ requestStatus: status, projectId: id }} />
}
