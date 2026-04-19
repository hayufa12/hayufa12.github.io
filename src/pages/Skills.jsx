import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useSkills } from '../hooks/useSkills'

export default function Skills() {
  const ref = useRef(null)
  const { groups } = useSkills()
  useReveal(ref, false, [groups])

  return (
    <section id="skills" ref={ref} aria-label="Skills" className="px-12 py-24 bg-white">
      <div className="max-w-[1100px] mx-auto">
        <div className="reveal inline-block bg-navy text-white/70 text-[10px] font-bold tracking-[0.15em] uppercase px-[10px] py-1 rounded mb-[14px]">Skills</div>
        <h1 className="reveal reveal-d1 text-[clamp(24px,3vw,32px)] font-extrabold text-navy tracking-tight leading-snug mb-10">Technical Toolkit</h1>
        <div className="grid grid-cols-2 gap-5 max-[860px]:grid-cols-1">
          {groups.map((g, i) => (
            <div
              key={g.category}
              className={`reveal reveal-d${i + 1} bg-bg-2 border border-border p-6 rounded-xl transition-all duration-200 hover:shadow-[0_4px_16px_rgba(26,26,46,0.08)] hover:border-border-2`}
            >
              <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-text3 mb-[14px]">{g.category}</div>
              <div className="flex flex-wrap gap-2">
                {g.skills.map(s => (
                  <span
                    key={s.id}
                    className={`text-xs font-semibold px-[13px] py-[5px] rounded-md ${s.is_dark ? 'bg-navy text-white' : 'bg-bg-3 text-navy'}`}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
