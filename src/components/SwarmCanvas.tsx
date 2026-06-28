import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { facePoints } from '../data/face'

export type Formation = 'free' | 'grid' | 'line' | 'orbit' | 'sina' | 'face'

type Agent = {
  x: number
  y: number
  vx: number
  vy: number
  id: string
  tag: boolean
  fr: number
  fg: number
  fb: number
  phase: number
}

const COLORS = {
  cyan: '#7fd0ff',
  cyanBright: '#22d3ee',
  dim: '#5e83a6',
  link: '120, 180, 255',
}

/**
 * The signature "Living Schematic" element: a multi-agent drone swarm in
 * blueprint vernacular. Free mode = boids drift + cursor formation + comms
 * graph + live dimension measurement. Commanded modes re-task agents into
 * formation slots; "face" assembles an edge-detected portrait (points + colour
 * sampled locally from a photo — the image itself is never shipped).
 */
export default function SwarmCanvas({ formation }: { formation: Formation }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const formationRef = useRef<Formation>(formation)
  const reduced = useReducedMotion()

  useEffect(() => {
    formationRef.current = formation
  }, [formation])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    const pointer = { x: -9999, y: -9999, active: false }
    let raf = 0
    let running = true
    let t = 0
    let lastFormation = ''
    let targets: { x: number; y: number }[] = []

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      lastFormation = '__rebuild__'
    }

    const small = window.innerWidth < 480
    const count = small ? 170 : facePoints.length
    const faceFor = (i: number) => facePoints[Math.floor((i / count) * facePoints.length)]
    const LINK_DIST = small ? 58 : 66
    const ATTRACT = 150

    resize()

    const agents: Agent[] = []
    for (let i = 0; i < count; i++) {
      const f = faceFor(i)
      const startFace = reduced && formationRef.current === 'face'
      agents.push({
        x: startFace ? f.x * width : Math.random() * width,
        y: startFace ? f.y * height : Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        id: 'A' + (i + 1),
        tag: i % 17 === 0,
        fr: f.r, fg: f.g, fb: f.b,
        phase: Math.random() * Math.PI * 2,
      })
    }
    window.addEventListener('resize', resize)

    // ---- formation target builders ----
    const sampleText = (text: string): { x: number; y: number }[] => {
      const off = document.createElement('canvas')
      off.width = Math.max(2, Math.round(width))
      off.height = Math.max(2, Math.round(height))
      const octx = off.getContext('2d')
      if (!octx) return []
      octx.fillStyle = '#fff'
      octx.textAlign = 'center'
      octx.textBaseline = 'middle'
      const fs = Math.min(width / 2.6, height / 1.6)
      octx.font = `700 ${fs}px "Chakra Petch", sans-serif`
      octx.fillText(text, width / 2, height / 2)
      const data = octx.getImageData(0, 0, off.width, off.height).data
      const pts: { x: number; y: number }[] = []
      const stp = 5
      for (let y = 0; y < off.height; y += stp) {
        for (let x = 0; x < off.width; x += stp) {
          if (data[(y * off.width + x) * 4 + 3] > 128) pts.push({ x, y })
        }
      }
      return pts
    }

    const buildTargets = (f: string) => {
      const m = 22
      if (f === 'face') {
        return Array.from({ length: count }, (_, i) => {
          const p = faceFor(i)
          return { x: p.x * width, y: p.y * height }
        })
      }
      if (f === 'grid') {
        const cols = Math.ceil(Math.sqrt(count))
        const rows = Math.ceil(count / cols)
        return Array.from({ length: count }, (_, i) => ({
          x: m + ((i % cols) + 0.5) * ((width - 2 * m) / cols),
          y: m + (Math.floor(i / cols) + 0.5) * ((height - 2 * m) / rows),
        }))
      }
      if (f === 'line') {
        return Array.from({ length: count }, (_, i) => ({
          x: m + (i + 0.5) * ((width - 2 * m) / count),
          y: height / 2,
        }))
      }
      if (f === 'sina') {
        const pts = sampleText('SINA')
        if (!pts.length) return buildTargets('grid')
        return Array.from({ length: count }, (_, i) => pts[Math.floor((i / count) * pts.length)])
      }
      return []
    }

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(127,208,255,0.05)'
      ctx.lineWidth = 1
      const s = 28
      for (let x = 0; x <= width; x += s) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke() }
      for (let y = 0; y <= height; y += s) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke() }
    }

    const drawDimension = (a: Agent, b: Agent) => {
      const dx = b.x - a.x, dy = b.y - a.y
      const len = Math.hypot(dx, dy)
      if (len < 8) return
      const ang = Math.atan2(dy, dx)
      ctx.save()
      ctx.translate(a.x, a.y)
      ctx.rotate(ang)
      ctx.strokeStyle = COLORS.cyan
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(len, 0); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(0, 5); ctx.moveTo(len, -5); ctx.lineTo(len, 5); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(6, -3); ctx.lineTo(0, 0); ctx.lineTo(6, 3); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(len - 6, -3); ctx.lineTo(len, 0); ctx.lineTo(len - 6, 3); ctx.stroke()
      const label = `${(len / 26).toFixed(2)} m`
      ctx.font = '9px "IBM Plex Mono", monospace'
      const tw = ctx.measureText(label).width
      const flip = ang > Math.PI / 2 || ang < -Math.PI / 2
      ctx.save()
      ctx.translate(len / 2, -7)
      if (flip) ctx.rotate(Math.PI)
      ctx.fillStyle = '#07172b'
      ctx.fillRect(-tw / 2 - 3, -9, tw + 6, 12)
      ctx.fillStyle = COLORS.cyan
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(label, 0, -3)
      ctx.restore()
      ctx.restore()
    }

    const step = () => {
      t++
      ctx.clearRect(0, 0, width, height)
      drawGrid()

      const f = formationRef.current
      const commanded = f !== 'free'
      const faceMode = f === 'face'

      if (f !== lastFormation || f === 'orbit') {
        lastFormation = f
        if (f === 'orbit') {
          const cx = width / 2, cy = height / 2
          const rad = Math.min(width, height) * 0.36
          targets = Array.from({ length: count }, (_, i) => {
            const a = (i / count) * Math.PI * 2 + t * 0.01
            return { x: cx + rad * Math.cos(a), y: cy + rad * Math.sin(a) }
          })
        } else if (f !== 'free') {
          targets = buildTargets(f)
        } else {
          targets = []
        }
      }

      for (let i = 0; i < agents.length; i++) {
        const a = agents[i]
        if (reduced) continue
        if (commanded && targets[i]) {
          const k = faceMode ? 0.05 : 0.025
          a.vx += (targets[i].x - a.x) * k
          a.vy += (targets[i].y - a.y) * k
          a.vx *= faceMode ? 0.78 : 0.86
          a.vy *= faceMode ? 0.78 : 0.86
          a.x += a.vx
          a.y += a.vy
        } else {
          a.x += a.vx
          a.y += a.vy
          a.vx += (Math.random() - 0.5) * 0.04
          a.vy += (Math.random() - 0.5) * 0.04
          a.vx *= 0.98
          a.vy *= 0.98
          if (a.x < 6) { a.x = 6; a.vx = Math.abs(a.vx) }
          if (a.x > width - 6) { a.x = width - 6; a.vx = -Math.abs(a.vx) }
          if (a.y < 6) { a.y = 6; a.vy = Math.abs(a.vy) }
          if (a.y > height - 6) { a.y = height - 6; a.vy = -Math.abs(a.vy) }
          if (pointer.active) {
            const dx = pointer.x - a.x, dy = pointer.y - a.y
            const d = Math.hypot(dx, dy)
            if (d < ATTRACT && d > 1) { a.vx += (dx / d) * 0.06; a.vy += (dy / d) * 0.06 }
          }
        }
      }

      // comms graph (skipped in face mode for portrait clarity)
      if (!faceMode) {
        ctx.lineWidth = 0.7
        for (let i = 0; i < agents.length; i++) {
          for (let j = i + 1; j < agents.length; j++) {
            const a = agents[i], b = agents[j]
            const d = Math.hypot(a.x - b.x, a.y - b.y)
            if (d < LINK_DIST) {
              ctx.strokeStyle = `rgba(${COLORS.link},${(1 - d / LINK_DIST) * 0.3})`
              ctx.setLineDash([3, 4])
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
            }
          }
        }
        ctx.setLineDash([])
      }

      // nodes
      for (const a of agents) {
        if (faceMode) {
          // colour from photo, lifted for visibility, with low-frequency twinkle
          const tw = 0.55 + 0.45 * Math.sin(t * 0.03 + a.phase)
          const r = Math.min(255, a.fr + 55)
          const g = Math.min(255, a.fg + 55)
          const b = Math.min(255, a.fb + 55)
          ctx.fillStyle = `rgba(${r},${g},${b},${0.45 + 0.55 * tw})`
          ctx.beginPath(); ctx.arc(a.x, a.y, 1.7 + 0.8 * tw, 0, Math.PI * 2); ctx.fill()
          continue
        }
        const near = !commanded && pointer.active && Math.hypot(pointer.x - a.x, pointer.y - a.y) < ATTRACT
        const hot = near || commanded
        ctx.strokeStyle = hot ? 'rgba(34,211,238,0.32)' : 'rgba(127,208,255,0.16)'
        ctx.lineWidth = 1
        ctx.beginPath(); ctx.arc(a.x, a.y, hot ? 7 : 6, 0, Math.PI * 2); ctx.stroke()
        ctx.fillStyle = hot ? COLORS.cyanBright : COLORS.dim
        ctx.beginPath(); ctx.arc(a.x, a.y, hot ? 2.4 : 1.8, 0, Math.PI * 2); ctx.fill()
        if (a.tag && !commanded) {
          ctx.font = '7px "IBM Plex Mono", monospace'
          ctx.fillStyle = 'rgba(143,179,212,0.8)'
          ctx.textAlign = 'left'
          ctx.fillText(a.id, a.x + 8, a.y - 6)
        }
      }

      // dimension between two nearest to pointer (free mode)
      if (!commanded && pointer.active) {
        let n1: Agent | null = null, n2: Agent | null = null
        let d1 = Infinity, d2 = Infinity
        for (const a of agents) {
          const d = Math.hypot(pointer.x - a.x, pointer.y - a.y)
          if (d < d1) { d2 = d1; n2 = n1; d1 = d; n1 = a }
          else if (d < d2) { d2 = d; n2 = a }
        }
        if (n1 && n2) drawDimension(n1, n2)
      }

      if (running) raf = requestAnimationFrame(step)
    }

    const toLocal = (cx: number, cy: number) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = cx - rect.left
      pointer.y = cy - rect.top
      pointer.active = true
    }
    const onMove = (e: MouseEvent) => toLocal(e.clientX, e.clientY)
    const onLeave = () => { pointer.active = false; pointer.x = -9999; pointer.y = -9999 }
    const onTouch = (e: TouchEvent) => { if (e.touches[0]) toLocal(e.touches[0].clientX, e.touches[0].clientY) }
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)
    canvas.addEventListener('touchmove', onTouch, { passive: true })
    canvas.addEventListener('touchend', onLeave)

    const onVisibility = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(raf) }
      else if (!running) { running = true; raf = requestAnimationFrame(step) }
    }
    document.addEventListener('visibilitychange', onVisibility)

    raf = requestAnimationFrame(step)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
      canvas.removeEventListener('touchmove', onTouch)
      canvas.removeEventListener('touchend', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced])

  return <canvas ref={canvasRef} aria-hidden="true" />
}
