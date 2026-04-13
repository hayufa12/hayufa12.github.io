import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'

export default function About() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section ref={ref} aria-label="About" className="px-12 py-24 bg-white">
      <div className="max-w-[1100px] mx-auto grid grid-cols-[1fr_260px] gap-20 items-start max-[860px]:grid-cols-1 max-[860px]:gap-9">
        <div>
          <div className="reveal inline-block bg-navy text-white/70 text-[10px] font-bold tracking-[0.15em] uppercase px-[10px] py-1 rounded mb-[14px]">About</div>
          <h1 className="reveal reveal-d1 text-[clamp(24px,3vw,32px)] font-extrabold text-navy tracking-tight leading-snug mb-[22px]">Professional Summary</h1>
          <p className="reveal reveal-d2 text-[14.5px] text-text2 leading-[1.85]">
            Credit Risk Data Scientist with <strong className="text-navy font-semibold">4+ years of experience</strong> across Banking, Multi-Finance,
            and Credit Bureau sectors. Specialized in building <strong className="text-navy font-semibold">regulatory-grade Scorecards and ML models</strong> on
            massive datasets (100M+ subjects). Proven track record of leveraging national-scale credit data to drive{' '}
            <strong className="text-navy font-semibold">risk strategy and revenue growth</strong>. Led cross-functional teams to boost leads.
            Proficient in <strong className="text-navy font-semibold">Python, SQL, PySpark, and ML</strong>, focusing on actionable insights.
            Demonstrated leadership in data forums and bridging technical-business communication.
          </p>
        </div>
        <div>
          <div className="reveal inline-block bg-navy text-white/70 text-[10px] font-bold tracking-[0.15em] uppercase px-[10px] py-1 rounded mb-[14px]">Sectors</div>
          <div className="flex flex-col gap-2 mt-[14px]">
            {['Credit Bureau', 'Multi-Finance', 'Banking', 'BNPL / Personal Loan'].map((s, i) => (
              <div key={s} className={`reveal reveal-d${i + 1} bg-bg-2 border-l-[3px] border-navy px-[14px] py-[10px] text-[13px] font-medium text-navy rounded-r-md transition-all duration-200 hover:bg-bg-3 hover:translate-x-[3px]`}>
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
