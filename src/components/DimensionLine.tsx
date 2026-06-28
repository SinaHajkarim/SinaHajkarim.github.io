import { motion } from 'framer-motion'

/** A section divider drawn as an engineering dimension line that "measures"
 *  itself into view on scroll. */
export default function DimensionLine({ label }: { label: string }) {
  return (
    <motion.div
      className="dimline"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.4 }}
      aria-hidden="true"
    >
      <span className="tick" />
      <span className="arrow l" />
      <motion.span
        className="ln"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ transformOrigin: 'left' }}
      />
      <span className="cap">{label}</span>
      <motion.span
        className="ln"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ transformOrigin: 'right' }}
      />
      <span className="arrow r" />
      <span className="tick" />
    </motion.div>
  )
}
