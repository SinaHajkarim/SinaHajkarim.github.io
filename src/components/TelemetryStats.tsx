import { useEffect, useRef, useState } from 'react'
import { stats } from '../data/content'
import { useReducedMotion } from '../hooks/useReducedMotion'

function Counter({ value, suffix, display }: { value: number; suffix: string; display?: string }) {
  const reduced = useReducedMotion()
  const [n, setN] = useState(reduced ? value : 0)
  const ref = useRef<HTMLDivElement>(null)
  const done = useRef(false)

  useEffect(() => {
    if (display) return
    if (reduced) { setN(value); return }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !done.current) {
        done.current = true
        const dur = 1100
        const start = performance.now()
        const tick = (t: number) => {
          const p = Math.min((t - start) / dur, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setN(Math.round(eased * value))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [value, display, reduced])

  return (
    <div className="v" ref={ref}>
      {display ?? n}
      {suffix && <small>{suffix}</small>}
    </div>
  )
}

export default function TelemetryStats() {
  return (
    <div className="stats">
      {stats.map((s) => (
        <div className="stat" key={s.label}>
          <Counter value={s.value} suffix={s.suffix} display={'display' in s ? (s as { display?: string }).display : undefined} />
          <div className="k">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
