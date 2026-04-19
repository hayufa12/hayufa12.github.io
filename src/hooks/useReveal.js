import { useEffect } from 'react'

export function useReveal(containerRef, triggerImmediately = false, deps = []) {
  useEffect(() => {
    const container = containerRef?.current ?? document
    const els = container.querySelectorAll('.reveal:not(.visible)')

    if (triggerImmediately) {
      els.forEach(el => el.classList.add('visible'))
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, triggerImmediately, ...deps])
}
