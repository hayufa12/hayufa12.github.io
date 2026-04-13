import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'

const jobs = [
  {
    company: 'CRIF Lembaga Informasi Keuangan',
    role: 'Senior Analytics Consultant',
    date: 'Jan 2024 - Present',
    current: true,
    bullets: [
      'Developed and delivered multiple <strong>behavioral Scorecard models</strong> on the entire Indonesian credit data, combined with Telco data, on <strong>100+ million subjects</strong>.',
      'Built a <strong>high-dimensional feature store of 15,000+ derived attributes</strong> from raw SLIK data. Applied IV binning, missing value imputation, and feature clustering to reduce dimensionality to ~100 predictive features.',
      'Led the <strong>full model lifecycle PoC</strong> for 30+ major financial institutions - from segmentation analysis to model deployment. Established automated monitoring using PSI and GINI to detect model drift.',
      'Conducted <strong>Cut-Off analysis and Reject Inference</strong> to optimize risk strategy, achieving <strong>20–30% higher approval rates</strong> while maintaining flat NPL rates.',
      'Presented proof-of-concept solutions to key executives at <strong>50+ large financial institutions</strong>.',
      'Collaborated with the <strong>International CRIF team</strong> on Application, Behavioral, and Collection scorecards.',
      'Executed high-value <strong>market research projects</strong> (worth billions IDR) on Credit Card, BNPL, Personal Loan, and more.',
      'Served as <strong>acting Technical Lead</strong> for a squad of 3+ Analytics Consultants and Interns - conducting code reviews, overseeing delivery quality, and mentoring juniors.',
      'Created and maintained <strong>data-driven dashboards</strong> providing clients with real-time strategic insights.',
    ],
  },
  {
    company: 'Astra Financial',
    role: 'Data Scientist',
    date: 'Nov 2022 - Jan 2024',
    current: false,
    bullets: [
      'Led a major <strong>cross-sell and upsell project</strong>, driving a <strong>78% increase in valid leads</strong> and a <strong>35% rise in GMV</strong> across FIFGROUP, Astra Credit Companies, and Toyota Astra Financial Services.',
      'Led the <strong>Data Analytics Forum</strong> for Astra Financial and its subsidiaries, fostering collaboration and knowledge-sharing across data teams.',
      'Managed <strong>end-to-end ML model development</strong> for predictive analysis, improving targeting strategies and driving business growth.',
      'Collaborated with product and marketing teams to deliver <strong>actionable insights</strong> based on customer behavior.',
    ],
  },
  {
    company: 'Bank Sinarmas',
    role: 'Data Scientist → Data Science Graduate Camp (MT)',
    date: 'Jun 2021 - Nov 2022',
    current: false,
    bullets: [
      'Led development of a <strong>customer segmentation model</strong> using PySpark and Apache Spark, improving targeting capabilities.',
      'Delivered <strong>explainable AI solutions</strong>, enabling stakeholders to understand model outputs and make confident data-driven decisions.',
      'Presented comprehensive findings to <strong>senior leadership</strong>, translating complex data insights into actionable strategies.',
      'Led a key segmentation project resulting in improved marketing and product targeting strategies.',
    ],
  },
]

export default function Experience() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section ref={ref} aria-label="Experience" className="px-12 py-24 bg-bg-2 border-t border-b border-border">
      <div className="max-w-[1100px] mx-auto">
        <div className="reveal inline-block bg-navy text-white/70 text-[10px] font-bold tracking-[0.15em] uppercase px-[10px] py-1 rounded mb-[14px]">Experience</div>
        <h1 className="reveal reveal-d1 text-[clamp(24px,3vw,32px)] font-extrabold text-navy tracking-tight leading-snug mb-14">Career Timeline</h1>

        <div className="flex flex-col">
          {jobs.map((job, idx) => (
            <div key={job.company} className={`reveal flex gap-8 ${idx < jobs.length - 1 ? 'pb-12' : ''}`}>
              {/* Timeline column */}
              <div className="flex flex-col items-center w-5 flex-shrink-0">
                <div className={`w-[14px] h-[14px] rounded-full border-2 border-white flex-shrink-0 mt-[5px] ${job.current ? 'bg-green [box-shadow:0_0_0_3px_rgba(34,197,94,0.2)]' : 'bg-border-2 [box-shadow:0_0_0_2px_#c5cce0]'}`} />
                {idx < jobs.length - 1 && <div className="flex-1 w-[2px] bg-border mt-2" />}
              </div>
              {/* Content */}
              <div className="flex-1">
                <div className="text-[17px] font-bold text-navy mb-1">{job.company}</div>
                <div className="flex items-center gap-[10px] flex-wrap mb-4">
                  <span className="text-[13px] font-medium text-text2 italic">{job.role}</span>
                  <span className="text-[11px] font-semibold text-text3 bg-bg-3 px-[9px] py-[2px] rounded-[10px]">{job.date}</span>
                  {job.current && (
                    <span className="text-[10px] font-bold text-green bg-green/10 border border-green/20 px-2 py-[2px] rounded-[10px] tracking-wide">Current</span>
                  )}
                </div>
                <ul className="flex flex-col gap-[7px]">
                  {job.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="text-[13.5px] text-text2 leading-[1.65] pl-[18px] relative before:content-['→'] before:absolute before:left-0 before:text-navy before:text-[11px] before:font-bold before:top-[2px]"
                      dangerouslySetInnerHTML={{ __html: b }}
                    />
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
