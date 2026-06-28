import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { experience } from '../data/content'
import DimensionLine from './DimensionLine'

export default function Experience() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="experience" className="sheet">
      <DimensionLine label="SHEET 03 · REVISION LOG" />
      <div className="secthead" style={{ marginTop: '2.5rem' }}>
        <span className="no">03</span>
        <h2>Revision Log</h2>
        <span className="scale">EXPERIENCE</span>
      </div>

      <div className="xp">
        {experience.map((job, i) => {
          const expanded = open === i
          return (
            <div className="job" key={job.title} aria-expanded={expanded}>
              <button
                className="job-head"
                onClick={() => setOpen(expanded ? null : i)}
                aria-expanded={expanded}
                aria-controls={`job-body-${i}`}
              >
                <span className="when">{job.when}</span>
                <span>
                  <h3>{job.title}</h3>
                  <span className="org">{job.org}</span>
                </span>
                <span className="plus" aria-hidden="true">+</span>
              </button>
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    className="job-body"
                    id={`job-body-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                  >
                    <p>{job.detail}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
