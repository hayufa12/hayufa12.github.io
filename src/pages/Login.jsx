import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
    }

    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-bg-2 flex items-center justify-center px-6">
      <div className="w-full max-w-[400px] bg-white border border-border rounded-2xl p-10 shadow-sm">
        <div className="mb-8">
          <a href="/" className="text-[11px] font-bold tracking-[0.12em] uppercase text-text3 hover:text-navy transition-colors">
            ← Back to portfolio
          </a>
        </div>

        <h1 className="text-[22px] font-extrabold text-navy mb-1">
          {mode === 'login' ? 'Sign in' : 'Create account'}
        </h1>
        <p className="text-[13px] text-text3 mb-8">
          {mode === 'login' ? 'Access gated project tools.' : 'Register to request access to project tools.'}
        </p>

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

          {error && (
            <p className="text-[13px] text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy text-white text-[13px] font-semibold py-3 rounded-lg hover:bg-navy-2 transition-colors disabled:opacity-50"
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] text-text3">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null) }}
            className="text-navy font-semibold hover:underline"
          >
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
