import { motion } from 'framer-motion'
import { Linkedin, GraduationCap } from 'lucide-react'
import { profile } from '../data/content'
import DimensionLine from './DimensionLine'

export default function Connect() {
  return (
    <section id="connect" className="connect">
      <DimensionLine label="SHEET 05 · ISSUE FOR CONSTRUCTION" />
      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        style={{ marginTop: '3rem' }}
      >
        Let's build something<br /><span className="out">that flies.</span>
      </motion.h2>
      <p>
        Open to autonomy, robotics & real-time perception roles and
        collaborations. The best place to reach me:
      </p>
      <div className="links">
        <a className="btn" href={profile.links.linkedin} target="_blank" rel="noreferrer">
          <Linkedin /> LinkedIn
        </a>
        <a className="btn ghost" href={profile.links.scholar} target="_blank" rel="noreferrer">
          <GraduationCap /> Google Scholar
        </a>
      </div>
    </section>
  )
}
