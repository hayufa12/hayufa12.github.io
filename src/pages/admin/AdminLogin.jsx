import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) { setError(authError.message); setLoading(false); return }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', data.user.id)
      .single()

    if (roleData?.role !== 'admin') {
      await supabase.auth.signOut()
      setError('This account does not have admin access.')
      setLoading(false)
      return
    }

    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-bg-2 flex items-center justify-center px-6">
      <div className="w-full max-w-[400px] bg-white border border-border rounded-2xl p-10 shadow-sm">
        <div className="mb-8">
          <a href="/" className="text-[11px] font-bold tracking-[0.12em] uppercase text-text3 hover:text-navy transition-colors">
            ← Back to portfolio
          </a>
        </div>

        <h1 className="text-[22px] font-extrabold text-navy mb-1">Admin Login</h1>
        <p className="text-[13px] text-text3 mb-8">Sign in to manage your portfolio content.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-text3 mb-[6px]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-[10px] text-[14px] text-navy focus:outline-none focus:border-navy transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-text3 mb-[6px]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-[10px] text-[14px] text-navy focus:outline-none focus:border-navy transition-colors"
            />
          </div>

          {error && <p className="text-[13px] text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy text-white text-[13px] font-semibold py-3 rounded-lg hover:bg-navy-2 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
