import { useEffect, useState } from 'react'
import { useActiveSection } from '../hooks/useActiveSection'

const links = [
  { id: 'about',      label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills',     label: 'Skills' },
  { id: 'projects',   label: 'Projects' },
  { id: 'contact',    label: 'Contact' },
]

const SECTION_IDS = links.map(l => l.id)

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const activeId = useActiveSection(SECTION_IDS)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      aria-label="Main navigation"
      className={`sticky top-0 z-50 flex items-center justify-between px-12 h-16 bg-white/90 backdrop-blur-md border-b border-border transition-shadow duration-300 ${scrolled ? 'shadow-[0_2px_16px_rgba(26,26,46,0.08)]' : ''}`}
    >
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="text-lg font-extrabold text-navy tracking-tight"
      >
        HF
      </button>

      <div className="hidden md:flex gap-8">
        {links.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className={`text-[13px] font-medium transition-colors duration-200 ${activeId === id ? 'text-navy' : 'text-text3 hover:text-navy'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <button
        onClick={() => scrollTo('contact')}
        className="bg-navy text-white text-[13px] font-semibold px-5 py-[9px] rounded-lg transition-all duration-200 hover:bg-navy-2 hover:-translate-y-px"
      >
        Get in Touch
      </button>
    </nav>
  )
}
