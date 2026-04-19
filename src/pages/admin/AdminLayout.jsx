import { NavLink, Outlet, useNavigate, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import ProfileAdmin from './ProfileAdmin'
import ExperienceAdmin from './ExperienceAdmin'
import SkillsAdmin from './SkillsAdmin'
import ProjectsAdmin from './ProjectsAdmin'
import AccessRequestsAdmin from './AccessRequestsAdmin'

const nav = [
  { label: 'Profile', path: 'profile' },
  { label: 'Experience', path: 'experience' },
  { label: 'Skills', path: 'skills' },
  { label: 'Projects', path: 'projects' },
  { label: 'Access Requests', path: 'access-requests' },
]

export default function AdminLayout() {
  const navigate = useNavigate()

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex bg-bg-2">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-navy text-white flex flex-col">
        <div className="px-5 py-6 border-b border-white/10">
          <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/40 mb-1">Portfolio Admin</div>
          <div className="text-[15px] font-extrabold">Hafizh Fauzan</div>
        </div>
        <nav className="flex-1 py-4">
          {nav.map(item => (
            <NavLink
              key={item.path}
              to={`/admin/${item.path}`}
              className={({ isActive }) =>
                `block px-5 py-[10px] text-[13px] font-medium transition-colors duration-150 ${
                  isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-5 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="text-[12px] font-medium text-white/50 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ProfileAdmin />} />
          <Route path="experience" element={<ExperienceAdmin />} />
          <Route path="skills" element={<SkillsAdmin />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="access-requests" element={<AccessRequestsAdmin />} />
        </Routes>
      </main>
    </div>
  )
}
