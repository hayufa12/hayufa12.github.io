import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const empty = () => ({ company: '', role: '', period: '', description: [], is_current: false })

function JobForm({ job, onChange, onSave, onDelete, saving }) {
  function updateBullet(i, value) {
    const updated = [...job.description]
    updated[i] = value
    onChange({ ...job, description: updated })
  }

  function addBullet() {
    onChange({ ...job, description: [...job.description, ''] })
  }

  function removeBullet(i) {
    onChange({ ...job, description: job.description.filter((_, j) => j !== i) })
  }

  const cls = "w-full border border-border rounded-lg px-4 py-[10px] text-[13px] text-navy focus:outline-none focus:border-navy transition-colors"

  return (
    <div className="border border-border rounded-xl p-5 bg-white flex flex-col gap-4">
      <div className="flex gap-3">
        <input value={job.company} onChange={e => onChange({ ...job, company: e.target.value })}
          placeholder="Company" className={cls + ' flex-1'} />
        <label className="flex items-center gap-2 text-[12px] text-text3 whitespace-nowrap">
          <input type="checkbox" checked={job.is_current} onChange={e => onChange({ ...job, is_current: e.target.checked })} />
          Current
        </label>
      </div>
      <input value={job.role} onChange={e => onChange({ ...job, role: e.target.value })}
        placeholder="Role" className={cls} />
      <input value={job.period} onChange={e => onChange({ ...job, period: e.target.value })}
        placeholder="Period (e.g. Jan 2024 - Present)" className={cls} />

      <div className="flex flex-col gap-2">
        <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-text3">Bullets (HTML supported)</div>
        {job.description.map((b, i) => (
          <div key={i} className="flex gap-2">
            <textarea rows={2} value={b} onChange={e => updateBullet(i, e.target.value)}
              className={cls + ' flex-1 resize-none'} />
            <button onClick={() => removeBullet(i)} className="text-red-400 hover:text-red-600">×</button>
          </div>
        ))}
        <button onClick={addBullet} className="text-[12px] text-navy font-semibold hover:underline self-start">+ Add bullet</button>
      </div>

      <div className="flex gap-3">
        <button onClick={onSave} disabled={saving}
          className="bg-navy text-white text-[13px] font-semibold px-5 py-2 rounded-lg hover:bg-navy-2 transition-colors disabled:opacity-50">
          {saving ? 'Saving…' : 'Save'}
        </button>
        {job.id && (
          <button onClick={onDelete}
            className="text-[13px] font-semibold text-red-400 hover:text-red-600 px-5 py-2 rounded-lg border border-red-200 hover:border-red-400 transition-colors">
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

export default function ExperienceAdmin() {
  const [jobs, setJobs] = useState([])
  const [saving, setSaving] = useState(null)

  useEffect(() => {
    supabase.from('experience').select('*').order('sort_order').then(({ data }) => setJobs(data ?? []))
  }, [])

  function updateJob(i, updated) {
    setJobs(prev => prev.map((j, idx) => idx === i ? updated : j))
  }

  async function saveJob(i) {
    const job = jobs[i]
    setSaving(i)
    if (job.id) {
      await supabase.from('experience').update({
        company: job.company, role: job.role, period: job.period,
        description: job.description, is_current: job.is_current, sort_order: i,
      }).eq('id', job.id)
    } else {
      const { data } = await supabase.from('experience').insert({
        company: job.company, role: job.role, period: job.period,
        description: job.description, is_current: job.is_current, sort_order: i,
      }).select().single()
      if (data) updateJob(i, data)
    }
    setSaving(null)
  }

  async function deleteJob(i) {
    const job = jobs[i]
    if (job.id) await supabase.from('experience').delete().eq('id', job.id)
    setJobs(prev => prev.filter((_, idx) => idx !== i))
  }

  return (
    <div className="p-8 max-w-[720px]">
      <h2 className="text-[18px] font-extrabold text-navy mb-6">Experience</h2>
      <div className="flex flex-col gap-5 mb-5">
        {jobs.map((job, i) => (
          <JobForm key={job.id ?? i} job={job}
            onChange={updated => updateJob(i, updated)}
            onSave={() => saveJob(i)}
            onDelete={() => deleteJob(i)}
            saving={saving === i}
          />
        ))}
      </div>
      <button onClick={() => setJobs(prev => [...prev, empty()])}
        className="text-[13px] text-navy font-semibold hover:underline">
        + Add experience
      </button>
    </div>
  )
}
