import { useEffect, useState } from 'react'
import { profile } from '../data/content'

type State = 'IDLE' | 'TRACKING' | 'TRANSIT'

/** Live instrument strip fed by real interaction metrics. */
export default function StatusStrip() {
  const [vel, setVel] = useState('0.0')
  const [alt, setAlt] = useState('500')
  const [fps, setFps] = useState('60')
  const [state, setState] = useState<State>('IDLE')

  useEffect(() => {
    let lastX = 0, lastY = 0, hasLast = false
    let pxPerSec = 0
    let lastMoveT = 0, lastScrollT = 0
    let frames = 0, fpsT = performance.now(), curFps = 60
    let lastEmit = 0
    let raf = 0

    const onMove = (e: MouseEvent) => {
      const now = performance.now()
      if (hasLast) {
        const d = Math.hypot(e.clientX - lastX, e.clientY - lastY)
        const dt = Math.max(now - lastMoveT, 1) / 1000
        pxPerSec = pxPerSec * 0.6 + (d / dt) * 0.4
      }
      lastX = e.clientX; lastY = e.clientY; hasLast = true
      lastMoveT = now
    }
    const onScroll = () => { lastScrollT = performance.now() }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('scroll', onScroll, { passive: true })

    const loop = () => {
      const now = performance.now()
      frames++
      if (now - fpsT >= 500) {
        curFps = Math.round((frames * 1000) / (now - fpsT))
        frames = 0; fpsT = now
      }
      // decay velocity when idle
      if (now - lastMoveT > 120) pxPerSec *= 0.9

      if (now - lastEmit > 180) {
        lastEmit = now
        setVel((pxPerSec / 180).toFixed(1))
        const max = Math.max(document.body.scrollHeight - window.innerHeight, 1)
        const ratio = Math.min(window.scrollY / max, 1)
        setAlt(String(Math.round((1 - ratio) * 500)))
        setFps(String(curFps))
        if (now - lastScrollT < 220) setState('TRANSIT')
        else if (now - lastMoveT < 600) setState('TRACKING')
        else setState('IDLE')
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className="statusstrip" aria-hidden="true">
      <span>STATE: <b style={{ color: 'var(--cyan)' }}>{state}</b></span>
      <span className="live"><span className="dot" /> SYSTEM NOMINAL</span>
      <span className="telem">
        <span className="opt">VEL <b>{vel}</b> m/s</span>
        <span>ALT <b>{alt}</b> m</span>
        <span className="opt">{fps} FPS</span>
        <span className="coords">{profile.coords}</span>
      </span>
    </div>
  )
}
