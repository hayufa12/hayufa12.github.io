import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'

const contacts = [
  { icon: '📧', type: 'Email',    value: 'hayeef8@gmail.com',       href: 'mailto:hayeef8@gmail.com',               delay: '' },
  { icon: '📞', type: 'Phone',    value: '+62 812 2154 6465',        href: 'tel:+6281221546465',                     delay: 'reveal-d1' },
  { icon: '🔗', type: 'LinkedIn', value: 'linkedin.com/in/hafizhf', href: 'https://www.linkedin.com/in/hafizhf/',   delay: 'reveal-d2' },
]

export default function Contact() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section id="contact" ref={ref} aria-label="Contact" className="px-12 py-24 bg-navy text-white text-center">
      <div className="max-w-[700px] mx-auto">
        <div className="reveal inline-block bg-white/[0.12] text-white/60 text-[10px] font-bold tracking-[0.15em] uppercase px-[10px] py-1 rounded mb-4">Contact</div>
        <h1 className="reveal reveal-d1 text-[clamp(24px,3vw,32px)] font-extrabold text-white tracking-tight leading-snug mb-[14px]">Let's Work Together</h1>
        <p className="reveal reveal-d2 text-[14px] text-white/50 leading-[1.7] mb-11">
          Available for consulting engagements, full-time roles, and advisory work in credit risk &amp; data science.
        </p>
        <div className="flex flex-col gap-3 text-left">
          {contacts.map(c => (
            <a
              key={c.type}
              href={c.href}
              target={c.type === 'LinkedIn' ? '_blank' : undefined}
              rel={c.type === 'LinkedIn' ? 'noopener noreferrer' : undefined}
              className={`reveal ${c.delay} flex items-center gap-4 bg-white/[0.06] border border-white/10 px-5 py-4 rounded-[10px] transition-all duration-200 hover:bg-white/10 hover:border-white/20 hover:-translate-y-[2px]`}
            >
              <div className="text-[18px] w-10 text-center flex-shrink-0">{c.icon}</div>
              <div className="flex-1">
                <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/40 mb-[2px]">{c.type}</div>
                <div className="text-[14px] font-medium text-white">{c.value}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
