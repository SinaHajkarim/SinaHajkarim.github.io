import { motion } from 'framer-motion'
import { profile, education } from '../data/content'
import DimensionLine from './DimensionLine'
import TelemetryStats from './TelemetryStats'

export default function About() {
  return (
    <section id="about" className="sheet">
      <DimensionLine label="SHEET 01 · PROFILE" />
      <div className="secthead" style={{ marginTop: '2.5rem' }}>
        <span className="no">01</span>
        <h2>Profile</h2>
        <span className="scale">GENERAL NOTES</span>
      </div>

      <div className="about-grid">
        <motion.p
          className="lede"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          Real-time autonomy engineer with <strong>6+ years building
          safety-critical autonomy</strong> and state-estimation on real
          hardware — from fault-tolerant satellite attitude estimation under
          sensor dropout, through <strong>multi-agent autonomy verified
          closed-loop in flight</strong>, to a <strong>production multi-UxV
          fleet</strong> I own end-to-end today. Endorsed by the Royal Academy
          of Engineering in Autonomous Systems under the UK Global Talent route.
        </motion.p>

        <div>
          <div className="edu">
            {education.map((e) => (
              <div className="row" key={e.what}>
                <span className="yr">{e.yr}</span>
                <span><b>{e.what}</b><br />{e.where}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TelemetryStats />
      <p className="eyebrow" style={{ marginTop: '1rem', color: 'var(--dim)' }}>
        {profile.location}
      </p>
    </section>
  )
}
