import { useEffect } from 'react'

export function useCounter(elRef, target, duration = 1000) {
  useEffect(() => {
    const el = elRef.current
    if (!el) return

    let rafId

    const observer = new IntersectionObserver(
      entries => {
        if (!entries[0].isIntersecting) return
        observer.disconnect()

        const start = performance.now()
        const tick = now => {
          const p = Math.min((now - start) / duration, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          el.textContent = Math.floor(ease * target)
          if (p < 1) rafId = requestAnimationFrame(tick)
          else el.textContent = target
        }
        rafId = requestAnimationFrame(tick)
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(rafId)
    }
  }, [elRef, target, duration])
}
