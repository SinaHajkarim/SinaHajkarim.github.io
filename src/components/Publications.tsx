import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { publications, profile } from '../data/content'
import DimensionLine from './DimensionLine'

export default function Publications() {
  return (
    <section id="publications" className="sheet">
      <DimensionLine label="SHEET 04 · PUBLICATIONS" />
      <div className="secthead" style={{ marginTop: '2.5rem' }}>
        <span className="no">04</span>
        <h2>Publications</h2>
        <span className="scale">8 PEER-REVIEWED</span>
      </div>

      <div className="pubs">
        {publications.map((p, i) => (
          <motion.div
            className="pub"
            key={p.doi}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
          >
            <span className="yr">{p.yr}</span>
            <span className="t">
              {p.title} <span className="venue">— {p.venue}</span>
            </span>
            <a
              className="doi"
              href={`https://doi.org/${p.doi}`}
              target="_blank"
              rel="noreferrer"
              aria-label={`DOI for ${p.title}`}
            >
              DOI ↗
            </a>
          </motion.div>
        ))}
      </div>

      <p className="pubs-foot">
        <a href={profile.links.scholar} target="_blank" rel="noreferrer">
          Full list on Google Scholar <ExternalLink size={13} style={{ verticalAlign: '-2px' }} />
        </a>
      </p>
    </section>
  )
}
