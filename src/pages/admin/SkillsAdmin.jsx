import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const empty = () => ({ name: '', category: '', is_dark: true })

function SkillRow({ skill, onChange, onSave, onDelete, saving }) {
  const cls = "border border-border rounded-lg px-3 py-2 text-[13px] text-navy focus:outline-none focus:border-navy transition-colors"
  return (
    <div className="flex gap-3 items-center">
      <input value={skill.name} onChange={e => onChange({ ...skill, name: e.target.value })}
        placeholder="Skill name" className={cls + ' flex-1'} />
      <input value={skill.category} onChange={e => onChange({ ...skill, category: e.target.value })}
        placeholder="Category" className={cls + ' w-40'} />
      <label className="flex items-center gap-1 text-[12px] text-text3 whitespace-nowrap">
        <input type="checkbox" checked={skill.is_dark}
          onChange={e => onChange({ ...skill, is_dark: e.target.checked })} />
        Dark
      </label>
      <button onClick={onSave} disabled={saving}
        className="text-[12px] font-semibold bg-navy text-white px-3 py-1 rounded-lg hover:bg-navy-2 disabled:opacity-50 transition-colors">
        {saving ? '…' : 'Save'}
      </button>
      <button onClick={onDelete} className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
    </div>
  )
}

export default function SkillsAdmin() {
  const [skills, setSkills] = useState([])
  const [saving, setSaving] = useState(null)

  useEffect(() => {
    supabase.from('skills').select('*').order('sort_order').then(({ data }) => setSkills(data ?? []))
  }, [])

  function updateSkill(i, updated) {
    setSkills(prev => prev.map((s, idx) => idx === i ? updated : s))
  }

  async function saveSkill(i) {
    const skill = skills[i]
    setSaving(i)
    if (skill.id) {
      await supabase.from('skills').update({
        name: skill.name, category: skill.category, is_dark: skill.is_dark, sort_order: i,
      }).eq('id', skill.id)
    } else {
      const { data } = await supabase.from('skills').insert({
        name: skill.name, category: skill.category, is_dark: skill.is_dark, sort_order: i,
      }).select().single()
      if (data) updateSkill(i, data)
    }
    setSaving(null)
  }

  async function deleteSkill(i) {
    const skill = skills[i]
    if (skill.id) await supabase.from('skills').delete().eq('id', skill.id)
    setSkills(prev => prev.filter((_, idx) => idx !== i))
  }

  return (
    <div className="p-8 max-w-[720px]">
      <h2 className="text-[18px] font-extrabold text-navy mb-2">Skills</h2>
      <p className="text-[12px] text-text3 mb-6">Skills with the same category name are grouped together on the portfolio.</p>
      <div className="flex flex-col gap-3 mb-5">
        {skills.map((skill, i) => (
          <SkillRow key={skill.id ?? i} skill={skill}
            onChange={updated => updateSkill(i, updated)}
            onSave={() => saveSkill(i)}
            onDelete={() => deleteSkill(i)}
            saving={saving === i}
          />
        ))}
      </div>
      <button onClick={() => setSkills(prev => [...prev, empty()])}
        className="text-[13px] text-navy font-semibold hover:underline">
        + Add skill
      </button>
    </div>
  )
}
