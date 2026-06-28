import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Linkedin, GraduationCap } from 'lucide-react'
import { profile } from '../data/content'
import SwarmCanvas, { type Formation } from './SwarmCanvas'
import ErrorBoundary from './ErrorBoundary'

const ease = [0.22, 1, 0.36, 1] as const

const FORMATIONS: { id: Formation; label: string }[] = [
  { id: 'face', label: 'Portrait' },
  { id: 'free', label: 'Disperse' },
  { id: 'grid', label: 'Grid' },
  { id: 'line', label: 'Line' },
  { id: 'orbit', label: 'Orbit' },
  { id: 'sina', label: 'Spell' },
]

const panelLabel = (f: Formation) =>
  f === 'free'
    ? 'MOVE CURSOR → FORM SWARM'
    : f === 'face'
      ? 'EDGE-DETECTED PORTRAIT'
      : `FORMATION: ${f.toUpperCase()}`

export default function Hero() {
  const [formation, setFormation] = useState<Formation>('face')

  return (
    <section id="hero" className="hero">
      <div>
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
          // DWG SH-001 — general arrangement
        </motion.p>

        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6, ease }}>
          {profile.firstName}
          <br />
          <span className="out">{profile.lastName}</span>
        </motion.h1>

        <motion.p className="role" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45, duration: 0.6 }}>
          {profile.role}
        </motion.p>

        <motion.p className="lede" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }}>
          I build safety-critical autonomy that flies — multi-agent planning,
          real-time perception on edge compute, and a production drone fleet I
          own end-to-end.
        </motion.p>

        <motion.div className="cta" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.5 }}>
          <a className="btn" href="#about"><ArrowDown /> Descend</a>
          <a className="btn ghost" href={profile.links.linkedin} target="_blank" rel="noreferrer"><Linkedin /> LinkedIn</a>
          <a className="btn ghost" href={profile.links.scholar} target="_blank" rel="noreferrer"><GraduationCap /> Scholar</a>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.8, ease }}>
        <div className="swarm-panel">
          <ErrorBoundary>
            <SwarmCanvas formation={formation} />
          </ErrorBoundary>
          <span className="lbl tl">MISSION MAP · LIVE</span>
          <span className="lbl bl">{panelLabel(formation)}</span>
        </div>
        <div className="swarm-cmd" role="group" aria-label="Swarm formation command">
          <span className="lead">CMD ▸</span>
          {FORMATIONS.map((f) => (
            <button
              key={f.id}
              className={formation === f.id ? 'active' : ''}
              onClick={() => setFormation(f.id)}
              aria-pressed={formation === f.id}
            >
              {f.label}
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
