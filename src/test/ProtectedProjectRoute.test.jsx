import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ProtectedProjectRoute from '../components/ProtectedProjectRoute'

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }))
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    }),
  },
}))

import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

function wrap(element) {
  return (
    <MemoryRouter initialEntries={['/projects/abc']}>
      <Routes>
        <Route path="/projects/:id" element={element} />
        <Route path="/login" element={<div>login page</div>} />
        <Route path="/projects" element={<div>projects page</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedProjectRoute', () => {
  it('redirects to /login when not authenticated', async () => {
    useAuth.mockReturnValue({ user: null, loading: false })
    render(wrap(<ProtectedProjectRoute><div>tool</div></ProtectedProjectRoute>))
    await waitFor(() => expect(screen.getByText('login page')).toBeInTheDocument())
  })

  it('renders children when access is approved', async () => {
    useAuth.mockReturnValue({ user: { id: 'u1' }, loading: false })
    supabase.from().select().eq().eq().single.mockResolvedValueOnce({
      data: { status: 'approved' },
    })
    render(wrap(<ProtectedProjectRoute><div>tool</div></ProtectedProjectRoute>))
    await waitFor(() => expect(screen.getByText('tool')).toBeInTheDocument())
  })

  it('redirects to /projects when access is pending', async () => {
    useAuth.mockReturnValue({ user: { id: 'u1' }, loading: false })
    supabase.from().select().eq().eq().single.mockResolvedValueOnce({
      data: { status: 'pending' },
    })
    render(wrap(<ProtectedProjectRoute><div>tool</div></ProtectedProjectRoute>))
    await waitFor(() => expect(screen.getByText('projects page')).toBeInTheDocument())
  })
})
