import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import ProtectedAdminRoute from '../components/ProtectedAdminRoute'

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '../context/AuthContext'

describe('ProtectedAdminRoute', () => {
  it('renders children when user is admin', () => {
    useAuth.mockReturnValue({ user: { id: '1' }, isAdmin: true, loading: false })
    render(
      <MemoryRouter>
        <ProtectedAdminRoute><div>admin content</div></ProtectedAdminRoute>
      </MemoryRouter>
    )
    expect(screen.getByText('admin content')).toBeInTheDocument()
  })

  it('redirects to /admin/login when not admin', () => {
    useAuth.mockReturnValue({ user: null, isAdmin: false, loading: false })
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <ProtectedAdminRoute><div>admin content</div></ProtectedAdminRoute>
      </MemoryRouter>
    )
    expect(screen.queryByText('admin content')).not.toBeInTheDocument()
  })

  it('renders nothing while loading', () => {
    useAuth.mockReturnValue({ user: null, isAdmin: false, loading: true })
    const { container } = render(
      <MemoryRouter>
        <ProtectedAdminRoute><div>admin content</div></ProtectedAdminRoute>
      </MemoryRouter>
    )
    expect(container.firstChild).toBeNull()
  })
})
