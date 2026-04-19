import { useRef, useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useProjects } from '../hooks/useProjects'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

function LockIcon() {
  return (
    <svg className="w-4 h-4 text-text3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )
}

function ProjectCard({ project, userRequest, onRequestAccess }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  function handleAction() {
    if (!project.is_gated) {
      navigate(`/projects/${project.id}`)
      return
    }
    if (!user) {
      navigate('/login', { state: { projectId: project.id } })
      return
    }
    if (userRequest?.status === 'approved') {
      navigate(`/projects/${project.id}`)
      return
    }
    if (!userRequest) {
      onRequestAccess(project.id)
    }
  }

  function getActionLabel() {
    if (!project.is_gated) return 'Open Project'
    if (!user) return 'Request Access'
    if (userRequest?.status === 'approved') return 'Open Project'
    if (userRequest?.status === 'pending') return 'Pending Approval'
    if (userRequest?.status === 'rejected') return 'Access Denied'
    return 'Request Access'
  }

  const isPending = userRequest?.status === 'pending'
  const isRejected = userRequest?.status === 'rejected'

  return (
    <div className="bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-bold text-navy leading-snug">{project.title}</h3>
        {project.is_gated && <LockIcon />}
      </div>
      <p className="text-[13px] text-text3 leading-[1.7] flex-1">{project.description}</p>
      {project.tech_stack?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {project.tech_stack.map(t => (
            <span key={t} className="text-[11px] font-semibold bg-bg-2 text-navy px-2 py-[3px] rounded">{t}</span>
          ))}
        </div>
      )}
      <button
        onClick={handleAction}
        disabled={isPending || isRejected}
        className={`mt-auto text-[13px] font-semibold px-4 py-2 rounded-lg transition-all duration-200
          ${isPending || isRejected
            ? 'bg-bg-2 text-text3 cursor-not-allowed'
            : 'bg-navy text-white hover:bg-navy-2 hover:-translate-y-px'
          }`}
      >
        {getActionLabel()}
      </button>
    </div>
  )
}

export default function Projects() {
  const ref = useRef(null)
  const { projects, loading } = useProjects()
  useReveal(ref, false, [projects])
  const { user } = useAuth()
  const [requests, setRequests] = useState({})

  async function handleRequestAccess(projectId) {
    if (!user) return
    const { data } = await supabase
      .from('access_requests')
      .insert({ user_id: user.id, project_id: projectId })
      .select()
      .single()
    if (data) {
      setRequests(prev => ({ ...prev, [projectId]: data }))
    }
  }

  return (
    <section id="projects" ref={ref} aria-label="Projects" className="px-12 py-24 bg-bg-2">
      <div className="max-w-[1100px] mx-auto">
        <div className="reveal inline-block bg-navy text-white/70 text-[10px] font-bold tracking-[0.15em] uppercase px-[10px] py-1 rounded mb-[14px]">Projects</div>
        <h1 className="reveal reveal-d1 text-[clamp(24px,3vw,32px)] font-extrabold text-navy tracking-tight leading-snug mb-10">Work & Tools</h1>
        {loading ? null : projects.length === 0 ? (
          <div className="max-w-[500px] mx-auto text-center bg-white border border-border rounded-2xl p-12 shadow-sm">
            <p className="text-[14px] text-text3 leading-[1.7]">
              Projects will be showcased here soon. Check back later for case studies and work samples in credit risk and data science.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 max-[860px]:grid-cols-1">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                userRequest={requests[project.id]}
                onRequestAccess={handleRequestAccess}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
