import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * Custom cursor that visualises state estimation: the native arrow is the
 * measurement (truth); the cyan reticle is a constant-velocity Kalman estimate
 * that predicts + corrects, and the ellipse is its covariance — it swells along
 * the direction of motion (more uncertainty when moving fast) and contracts
 * when still. A nod to the modified-UKF work.
 */
export default function KalmanCursor() {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    // skip on touch / coarse pointers and reduced motion
    if (reduced || window.matchMedia('(pointer: coarse)').matches) return
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // measured (truth) and estimated state
    const meas = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    let est = { x: meas.x, y: meas.y }
    let vel = { x: 0, y: 0 }
    let prevMeas = { x: meas.x, y: meas.y }
    let P = 40 // covariance (scalar, isotropic base)
    let active = false
    let raf = 0

    const Q = 0.6 // process noise per frame
    const R = 14 // measurement noise

    const onMove = (e: MouseEvent) => {
      meas.x = e.clientX
      meas.y = e.clientY
      active = true
    }
    const onLeave = () => { active = false }
    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)

    const step = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      if (active) {
        // measured velocity
        const mvx = meas.x - prevMeas.x
        const mvy = meas.y - prevMeas.y
        prevMeas = { x: meas.x, y: meas.y }

        // predict (constant velocity)
        const predX = est.x + vel.x
        const predY = est.y + vel.y
        P += Q

        // update with measurement
        const K = P / (P + R)
        est = { x: predX + K * (meas.x - predX), y: predY + K * (meas.y - predY) }
        // velocity estimate blends prediction + measured motion
        vel = { x: vel.x * 0.7 + mvx * 0.3, y: vel.y * 0.7 + mvy * 0.3 }
        P = (1 - K) * P

        const speed = Math.hypot(vel.x, vel.y)
        const ang = Math.atan2(vel.y, vel.x)

        // covariance ellipse: base from P, elongated along motion
        const rb = 6 + P * 0.5
        const ra = rb + speed * 1.6

        ctx.save()
        ctx.translate(est.x, est.y)
        ctx.rotate(ang)
        // ellipse
        ctx.strokeStyle = 'rgba(127,208,255,0.5)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.ellipse(0, 0, ra, rb, 0, 0, Math.PI * 2)
        ctx.stroke()
        ctx.fillStyle = 'rgba(34,211,238,0.06)'
        ctx.fill()
        ctx.restore()

        // reticle (estimate)
        ctx.strokeStyle = '#22d3ee'
        ctx.lineWidth = 1.2
        const r = 9
        ctx.beginPath()
        ctx.arc(est.x, est.y, r, 0, Math.PI * 2)
        ctx.moveTo(est.x - r - 4, est.y); ctx.lineTo(est.x - r + 2, est.y)
        ctx.moveTo(est.x + r - 2, est.y); ctx.lineTo(est.x + r + 4, est.y)
        ctx.moveTo(est.x, est.y - r - 4); ctx.lineTo(est.x, est.y - r + 2)
        ctx.moveTo(est.x, est.y + r - 2); ctx.lineTo(est.x, est.y + r + 4)
        ctx.stroke()

        // line from estimate to measurement (innovation)
        ctx.strokeStyle = 'rgba(168,85,247,0.5)'
        ctx.setLineDash([2, 3])
        ctx.beginPath(); ctx.moveTo(est.x, est.y); ctx.lineTo(meas.x, meas.y); ctx.stroke()
        ctx.setLineDash([])

        // tiny label
        ctx.font = '8px "IBM Plex Mono", monospace'
        ctx.fillStyle = 'rgba(143,179,212,0.85)'
        ctx.fillText(`EST σ${P.toFixed(1)}`, est.x + 13, est.y - 11)
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [reduced])

  if (reduced) return null
  return <canvas ref={ref} className="kalman-cursor" aria-hidden="true" />
}
