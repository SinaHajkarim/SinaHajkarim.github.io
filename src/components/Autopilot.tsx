import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plane, Square } from 'lucide-react'
import { useReducedMotion } from '../hooks/useReducedMotion'

type Stop = { id: string; tag: string; line: string }

const STOPS: Stop[] = [
  { id: 'hero', tag: 'WAYPOINT 00 · GENERAL', line: 'Systems online. Meet Sina — autonomy & UxV software engineer.' },
  { id: 'about', tag: 'WAYPOINT 01 · PROFILE', line: '6+ years of safety-critical autonomy and state-estimation on real hardware.' },
  { id: 'skills', tag: 'WAYPOINT 02 · SUBSYSTEMS', line: 'A full stack from perception and ML to control, edge compute and PLC safety.' },
  { id: 'experience', tag: 'WAYPOINT 03 · LOG', line: 'From fault-tolerant satellite estimation to a production drone fleet owned end-to-end.' },
  { id: 'publications', tag: 'WAYPOINT 04 · PAPERS', line: '8 peer-reviewed publications in autonomy, planning and control.' },
  { id: 'connect', tag: 'WAYPOINT 05 · CONNECT', line: "Let's build something that flies. — End of autonomous demo." },
]

const DWELL = 3600
const IDLE_TRIGGER = 45000

export default function Autopilot() {
  const reduced = useReducedMotion()
  const [running, setRunning] = useState(false)
  const [stop, setStop] = useState<Stop | null>(null)
  const cancelRef = useRef(false)
  const runningRef = useRef(false)

  const stopTour = useCallback(() => {
    cancelRef.current = true
    runningRef.current = false
    setRunning(false)
    setStop(null)
  }, [])

  const runTour = useCallback(async () => {
    if (runningRef.current || reduced) return
    runningRef.current = true
    cancelRef.current = false
    setRunning(true)
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
    for (const s of STOPS) {
      if (cancelRef.current) break
      const el = document.getElementById(s.id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setStop(s)
      await sleep(DWELL)
    }
    runningRef.current = false
    setRunning(false)
    setStop(null)
  }, [reduced])

  // cancel on any genuine user input while running
  useEffect(() => {
    if (!running) return
    const cancel = () => stopTour()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') stopTour() }
    window.addEventListener('wheel', cancel, { passive: true })
    window.addEventListener('touchstart', cancel, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', cancel)
      window.removeEventListener('touchstart', cancel)
      window.removeEventListener('keydown', onKey)
    }
  }, [running, stopTour])

  // gentle idle auto-start (desktop, motion allowed, at top of page)
  useEffect(() => {
    if (reduced) return
    let timer: number
    const reset = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        if (!runningRef.current && window.scrollY < 40) runTour()
      }, IDLE_TRIGGER)
    }
    const evts = ['mousemove', 'wheel', 'keydown', 'touchstart', 'click']
    evts.forEach((e) => window.addEventListener(e, reset, { passive: true }))
    reset()
    return () => {
      window.clearTimeout(timer)
      evts.forEach((e) => window.removeEventListener(e, reset))
    }
  }, [reduced, runTour])

  if (reduced) return null

  return (
    <>
      <button
        className={`autopilot-btn${running ? ' running' : ''}`}
        onClick={() => (running ? stopTour() : runTour())}
        aria-label={running ? 'Stop autonomous demo' : 'Start autonomous demo'}
      >
        {running ? <Square size={13} /> : <Plane size={13} />}
        {running ? 'ABORT' : 'AUTONOMOUS DEMO'}
      </button>

      <AnimatePresence>
        {running && stop && (
          <motion.div
            className="tour-callout"
            key={stop.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4 }}
          >
            <div className="h">
              <span>{stop.tag}</span>
              <span>AUTOPILOT ENGAGED</span>
            </div>
            <div className="body">{stop.line}</div>
            <div className="pbar">
              <motion.i
                key={stop.id + '-bar'}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: DWELL / 1000, ease: 'linear' }}
              />
            </div>
            <div className="hint">scroll, tap or press esc to take manual control</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
