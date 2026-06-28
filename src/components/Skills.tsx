import { motion } from 'framer-motion'
import { skills } from '../data/content'
import DimensionLine from './DimensionLine'

// stable per-card "detection confidence" for the YOLO-style hover boxes
const CONF = [0.98, 0.95, 0.99, 0.94, 0.92, 0.97]

export default function Skills() {
  return (
    <section id="skills" className="sheet">
      <DimensionLine label="SHEET 02 · SUBSYSTEMS" />
      <div className="secthead" style={{ marginTop: '2.5rem' }}>
        <span className="no">02</span>
        <h2>Subsystems</h2>
        <span className="scale">REF A1 — A6 · HOVER TO DETECT</span>
      </div>

      <div className="parts">
        {skills.map((g, i) => (
          <motion.article
            className="part"
            key={g.ref}
            tabIndex={0}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
          >
            <span className="det-corner tl" aria-hidden="true" />
            <span className="det-corner tr" aria-hidden="true" />
            <span className="det-corner bl" aria-hidden="true" />
            <span className="det-corner br" aria-hidden="true" />
            <span className="det-label" aria-hidden="true">
              subsystem {CONF[i % CONF.length].toFixed(2)}
            </span>
            <span className="ref">{g.ref}</span>
            <h3>{g.title}</h3>
            <div className="chips">
              {g.items.map((it) => (
                <span className="chip" key={it}>{it}</span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
