import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

function Field({ label, value, onChange, multiline = false }) {
  const cls = "w-full border border-border rounded-lg px-4 py-[10px] text-[14px] text-navy focus:outline-none focus:border-navy transition-colors"
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-text3 mb-[6px]">{label}</label>
      {multiline
        ? <textarea rows={4} value={value} onChange={e => onChange(e.target.value)} className={cls + ' resize-y'} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} className={cls} />
      }
    </div>
  )
}

function StatRow({ stat, onChange, onDelete }) {
  return (
    <div className="flex gap-3 items-center">
      <input
        type="text"
        value={stat.label}
        onChange={e => onChange({ ...stat, label: e.target.value })}
        placeholder="Label"
        className="flex-1 border border-border rounded-lg px-3 py-2 text-[13px] text-navy focus:outline-none focus:border-navy"
      />
      <input
        type="text"
        value={stat.value}
        onChange={e => onChange({ ...stat, value: e.target.value })}
        placeholder="Display value"
        className="w-28 border border-border rounded-lg px-3 py-2 text-[13px] text-navy focus:outline-none focus:border-navy"
      />
      <input
        type="number"
        value={stat.target ?? ''}
        onChange={e => onChange({ ...stat, target: e.target.value ? Number(e.target.value) : null })}
        placeholder="Target"
        className="w-20 border border-border rounded-lg px-3 py-2 text-[13px] text-navy focus:outline-none focus:border-navy"
      />
      <input
        type="text"
        value={stat.suffix ?? ''}
        onChange={e => onChange({ ...stat, suffix: e.target.value || null })}
        placeholder="Suffix"
        className="w-16 border border-border rounded-lg px-3 py-2 text-[13px] text-navy focus:outline-none focus:border-navy"
      />
      <button onClick={onDelete} className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
    </div>
  )
}

export default function ProfileAdmin() {
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('profile').select('*').single().then(({ data }) => setProfile(data))
    supabase.from('stats').select('*').order('sort_order').then(({ data }) => setStats(data ?? []))
  }, [])

  async function handleSave() {
    setSaving(true)
    await supabase.from('profile').update(profile).eq('id', profile.id)

    await supabase.from('stats').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (stats.length > 0) {
      await supabase.from('stats').insert(
        stats.map((s, i) => ({ label: s.label, value: s.value, target: s.target, suffix: s.suffix, sort_order: i }))
      )
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function addStat() {
    setStats(prev => [...prev, { label: '', value: '', target: null, suffix: null, sort_order: prev.length }])
  }

  if (!profile) return <div className="p-8 text-text3">Loading…</div>

  return (
    <div className="p-8 max-w-[680px]">
      <h2 className="text-[18px] font-extrabold text-navy mb-6">Profile</h2>
      <div className="flex flex-col gap-5 mb-8">
        <Field label="Name" value={profile.name} onChange={v => setProfile(p => ({ ...p, name: v }))} />
        <Field label="Title" value={profile.title} onChange={v => setProfile(p => ({ ...p, title: v }))} />
        <Field label="Tagline" value={profile.tagline} onChange={v => setProfile(p => ({ ...p, tagline: v }))} multiline />
        <Field label="Bio" value={profile.bio} onChange={v => setProfile(p => ({ ...p, bio: v }))} multiline />
        <Field label="Email" value={profile.email} onChange={v => setProfile(p => ({ ...p, email: v }))} />
        <Field label="Phone" value={profile.phone} onChange={v => setProfile(p => ({ ...p, phone: v }))} />
        <Field label="LinkedIn URL" value={profile.linkedin} onChange={v => setProfile(p => ({ ...p, linkedin: v }))} />
      </div>

      <h2 className="text-[16px] font-extrabold text-navy mb-4">Stats</h2>
      <div className="text-[11px] text-text3 mb-3">Target + Suffix = animated counter. Leave Target blank for static display.</div>
      <div className="flex flex-col gap-3 mb-4">
        {stats.map((stat, i) => (
          <StatRow
            key={i}
            stat={stat}
            onChange={updated => setStats(prev => prev.map((s, j) => j === i ? updated : s))}
            onDelete={() => setStats(prev => prev.filter((_, j) => j !== i))}
          />
        ))}
      </div>
      <button onClick={addStat} className="text-[13px] text-navy font-semibold hover:underline mb-8">+ Add stat</button>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-navy text-white text-[13px] font-semibold px-6 py-3 rounded-lg hover:bg-navy-2 transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  )
}
