import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { useCounter } from '../hooks/useCounter'
import photo from '../assets/photo.jpg'

function StatItem({ value, label, delay = '' }) {
  return (
    <div className={`reveal ${delay} px-7 py-9 border-r border-border last:border-r-0 hover:bg-bg-2 transition-colors duration-200`}>
      <div className="text-[40px] font-extrabold text-navy leading-none tracking-tight mb-2">{value}</div>
      <div className="text-xs font-medium text-text3 leading-snug">{label}</div>
    </div>
  )
}

function CounterStat({ target, suffix, label, delay = '' }) {
  const ref = useRef(null)
  useCounter(ref, target)
  return (
    <div className={`reveal ${delay} px-7 py-9 border-r border-border last:border-r-0 hover:bg-bg-2 transition-colors duration-200`}>
      <div className="text-[40px] font-extrabold text-navy leading-none tracking-tight mb-2">
        <span ref={ref}>0</span>{suffix}
      </div>
      <div className="text-xs font-medium text-text3 leading-snug">{label}</div>
    </div>
  )
}

export default function Home() {
  const heroRef = useRef(null)
  const bodyRef = useRef(null)
  useReveal(heroRef, true)
  useReveal(bodyRef)

  return (
    <>
      {/* HERO */}
      <section
        ref={heroRef}
        aria-label="Introduction"
        className="bg-gradient-to-br from-bg-2 to-bg-3 px-12 pt-20 pb-[72px]"
      >
        <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-[60px] flex-wrap">
          {/* Left */}
          <div className="flex-1 min-w-[280px]">
            <div className="reveal inline-flex items-center gap-2 bg-white border border-border text-text2 text-xs font-medium px-[14px] py-[6px] rounded-full mb-6 shadow-sm">
              <span className="w-[7px] h-[7px] rounded-full bg-green flex-shrink-0 [animation:pulse_2.5s_ease-in-out_infinite] [box-shadow:0_0_0_2px_rgba(34,197,94,0.2)]" />
              Open to opportunities
            </div>
            <h1 className="reveal reveal-d1 text-[clamp(40px,5.5vw,64px)] font-extrabold text-navy leading-[1.05] tracking-[-1.5px] mb-[14px]">
              Hafizh Fauzan
            </h1>
            <div className="reveal reveal-d2 text-base font-medium text-text2 mb-5">
              Credit Risk Data Scientist
            </div>
            <p className="reveal reveal-d2 text-[14px] text-text3 leading-[1.8] max-w-[460px] mb-9">
              4+ years building regulatory-grade scorecards and ML models on national-scale credit data.
              Specialized in risk strategy, feature engineering, and translating complex data insights
              for financial institutions.
            </p>
            <div className="reveal reveal-d3 flex gap-3 flex-wrap">
              <a
                href="/Resume Hafizh Fauzan.pdf"
                download
                className="inline-flex items-center gap-2 bg-navy text-white text-[13px] font-semibold px-[22px] py-3 rounded-lg transition-all duration-200 hover:bg-navy-2 hover:-translate-y-px"
              >
                Download Resume
              </a>
              <Link
                to="/experience"
                className="inline-flex items-center gap-2 bg-transparent text-navy border-2 border-navy text-[13px] font-semibold px-[22px] py-[10px] rounded-lg transition-all duration-200 hover:bg-navy/5 hover:-translate-y-px"
              >
                View Experience
              </Link>
            </div>
          </div>

          {/* Right */}
          <div className="reveal reveal-d2 flex-shrink-0 flex flex-col items-center gap-5">
            <div className="w-[220px] h-[220px] rounded-full border-4 border-navy overflow-hidden bg-bg-3 shadow-[0_8px_32px_rgba(26,26,46,0.15)]">
              <img
                src={photo}
                alt="Hafizh Fauzan"
                className="w-full h-full object-cover object-top"
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
              />
              <div className="hidden w-full h-full items-center justify-center text-[48px] font-extrabold text-navy">HF</div>
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {['Python', 'PySpark', 'SQL', 'ML'].map(s => (
                <span key={s} className="bg-white border border-border text-navy text-xs font-semibold px-3 py-[5px] rounded-full shadow-sm">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div ref={bodyRef}>
        {/* KEY NUMBERS */}
        <section aria-label="Key statistics" className="border-t border-b border-border bg-white">
          <div className="max-w-[1100px] mx-auto grid grid-cols-4 max-[860px]:grid-cols-2">
            <CounterStat target={4}   suffix="+" label="Years Experience" />
            <CounterStat target={100} suffix="M+" label="Credit Subjects Analyzed" delay="reveal-d1" />
            <CounterStat target={30}  suffix="+" label="Financial Institutions" delay="reveal-d2" />
            <StatItem value="20–30%" label="Approval Rate Lift" delay="reveal-d3" />
          </div>
        </section>

        {/* ABOUT PREVIEW */}
        <section aria-label="About" className="px-12 py-24 bg-white">
          <div className="max-w-[1100px] mx-auto grid grid-cols-[1fr_260px] gap-20 items-start max-[860px]:grid-cols-1 max-[860px]:gap-9">
            <div>
              <div className="reveal inline-block bg-navy text-white/70 text-[10px] font-bold tracking-[0.15em] uppercase px-[10px] py-1 rounded mb-[14px]">About</div>
              <h2 className="reveal reveal-d1 text-[clamp(24px,3vw,32px)] font-extrabold text-navy tracking-tight leading-snug mb-[22px]">Professional Summary</h2>
              <p className="reveal reveal-d2 text-[14.5px] text-text2 leading-[1.85]">
                Credit Risk Data Scientist with <strong className="text-navy font-semibold">4+ years of experience</strong> across Banking, Multi-Finance,
                and Credit Bureau sectors. Specialized in building <strong className="text-navy font-semibold">regulatory-grade Scorecards and ML models</strong> on massive datasets.
                Proven track record of leveraging national-scale credit data to drive <strong className="text-navy font-semibold">risk strategy and revenue growth</strong>.
              </p>
              <div className="reveal reveal-d3 mt-6">
                <Link to="/about" className="text-[13px] font-semibold text-navy border-b-2 border-navy pb-px hover:opacity-70 transition-opacity">
                  Read More →
                </Link>
              </div>
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
      </div>
    </>
  )
}
