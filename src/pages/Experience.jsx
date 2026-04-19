import { useRef } from 'react'
import DOMPurify from 'dompurify'
import { useReveal } from '../hooks/useReveal'
import { useExperience } from '../hooks/useExperience'

export default function Experience() {
  const ref = useRef(null)
  const { jobs } = useExperience()
  useReveal(ref, false, [jobs])

  return (
    <section id="experience" ref={ref} aria-label="Experience" className="px-12 py-24 bg-bg-2 border-t border-b border-border">
      <div className="max-w-[1100px] mx-auto">
        <div className="reveal inline-block bg-navy text-white/70 text-[10px] font-bold tracking-[0.15em] uppercase px-[10px] py-1 rounded mb-[14px]">Experience</div>
        <h1 className="reveal reveal-d1 text-[clamp(24px,3vw,32px)] font-extrabold text-navy tracking-tight leading-snug mb-14">Career Timeline</h1>
        <div className="flex flex-col">
          {jobs.map((job, idx) => (
            <div key={job.id} className={`reveal flex gap-8 ${idx < jobs.length - 1 ? 'pb-12' : ''}`}>
              <div className="flex flex-col items-center pt-1">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${job.is_current ? 'bg-accent' : 'bg-navy/30'}`} />
                {idx < jobs.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
              </div>
              <div className="flex-1 pb-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-[6px]">
                  <span className="text-[15px] font-bold text-navy">{job.company}</span>
                  {job.is_current && (
                    <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-accent bg-accent/10 px-2 py-[2px] rounded">Current</span>
                  )}
                </div>
                <div className="text-[13px] font-semibold text-text2 mb-[4px]">{job.role}</div>
                <div className="text-[12px] text-text3 mb-4">{job.period}</div>
                <ul className="flex flex-col gap-[10px]">
                  {job.description.map((bullet, i) => (
                    <li key={i} className="flex gap-3 text-[13.5px] text-text2 leading-[1.7]">
                      <span className="mt-[7px] w-[5px] h-[5px] rounded-full bg-navy/25 flex-shrink-0" />
                      <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(bullet) }} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
