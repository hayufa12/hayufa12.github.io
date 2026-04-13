import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'

const links = [
  { to: '/about',      label: 'About' },
  { to: '/experience', label: 'Experience' },
  { to: '/skills',     label: 'Skills' },
  { to: '/projects',   label: 'Projects' },
  { to: '/contact',    label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

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
      <Link to="/" className="text-lg font-extrabold text-navy tracking-tight">HF</Link>

      <div className="hidden md:flex gap-8">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `text-[13px] font-medium transition-colors duration-200 ${isActive ? 'text-navy' : 'text-text3 hover:text-navy'}`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>

      <Link
        to="/contact"
        className="bg-navy text-white text-[13px] font-semibold px-5 py-[9px] rounded-lg transition-all duration-200 hover:bg-navy-2 hover:-translate-y-px"
      >
        Get in Touch
      </Link>
    </nav>
  )
}
