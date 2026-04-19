import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const empty = () => ({ title: '', description: '', tech_stack: [], is_gated: false, is_published: true, project_url: '' })

function ProjectForm({ project, onChange, onSave, onDelete, saving }) {
  const cls = "w-full border border-border rounded-lg px-4 py-[10px] text-[13px] text-navy focus:outline-none focus:border-navy transition-colors"

  function handleTechStack(value) {
    onChange({ ...project, tech_stack: value.split(',').map(t => t.trim()).filter(Boolean) })
  }

  return (
    <div className="border border-border rounded-xl p-5 bg-white flex flex-col gap-4">
      <input value={project.title} onChange={e => onChange({ ...project, title: e.target.value })}
        placeholder="Project title" className={cls} />
      <textarea rows={3} value={project.description} onChange={e => onChange({ ...project, description: e.target.value })}
        placeholder="Description" className={cls + ' resize-none'} />
      <input value={project.tech_stack.join(', ')} onChange={e => handleTechStack(e.target.value)}
        placeholder="Tech stack (comma-separated, e.g. Python, FastAPI)" className={cls} />
      <input value={project.project_url ?? ''} onChange={e => onChange({ ...project, project_url: e.target.value })}
        placeholder="Project URL (for non-gated projects)" className={cls} />
      <div className="flex gap-5">
        <label className="flex items-center gap-2 text-[13px] text-text2">
          <input type="checkbox" checked={project.is_gated}
            onChange={e => onChange({ ...project, is_gated: e.target.checked })} />
          Requires account access
        </label>
        <label className="flex items-center gap-2 text-[13px] text-text2">
          <input type="checkbox" checked={project.is_published}
            onChange={e => onChange({ ...project, is_published: e.target.checked })} />
          Published
        </label>
      </div>
      <div className="flex gap-3">
        <button onClick={onSave} disabled={saving}
          className="bg-navy text-white text-[13px] font-semibold px-5 py-2 rounded-lg hover:bg-navy-2 transition-colors disabled:opacity-50">
          {saving ? 'Saving…' : 'Save'}
        </button>
        {project.id && (
          <button onClick={onDelete}
            className="text-[13px] font-semibold text-red-400 hover:text-red-600 px-5 py-2 rounded-lg border border-red-200 hover:border-red-400 transition-colors">
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([])
  const [saving, setSaving] = useState(null)

  useEffect(() => {
    supabase.from('projects').select('*').order('sort_order').then(({ data }) => setProjects(data ?? []))
  }, [])

  function updateProject(i, updated) {
    setProjects(prev => prev.map((p, idx) => idx === i ? updated : p))
  }

  async function saveProject(i) {
    const proj = projects[i]
    setSaving(i)
    const payload = {
      title: proj.title, description: proj.description, tech_stack: proj.tech_stack,
      is_gated: proj.is_gated, is_published: proj.is_published,
      project_url: proj.project_url || null, sort_order: i,
    }
    if (proj.id) {
      await supabase.from('projects').update(payload).eq('id', proj.id)
    } else {
      const { data } = await supabase.from('projects').insert(payload).select().single()
      if (data) updateProject(i, data)
    }
    setSaving(null)
  }

  async function deleteProject(i) {
    const proj = projects[i]
    if (proj.id) await supabase.from('projects').delete().eq('id', proj.id)
    setProjects(prev => prev.filter((_, idx) => idx !== i))
  }

  return (
    <div className="p-8 max-w-[720px]">
      <h2 className="text-[18px] font-extrabold text-navy mb-6">Projects</h2>
      <div className="flex flex-col gap-5 mb-5">
        {projects.map((proj, i) => (
          <ProjectForm key={proj.id ?? i} project={proj}
            onChange={updated => updateProject(i, updated)}
            onSave={() => saveProject(i)}
            onDelete={() => deleteProject(i)}
            saving={saving === i}
          />
        ))}
      </div>
      <button onClick={() => setProjects(prev => [...prev, empty()])}
        className="text-[13px] text-navy font-semibold hover:underline">
        + Add project
      </button>
    </div>
  )
}
