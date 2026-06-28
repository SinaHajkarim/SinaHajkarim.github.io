import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

/** Short orchestrated boot sequence: "initialising swarm". */
export default function Boot() {
  const reduced = useReducedMotion()
  const [show, setShow] = useState(!reduced)

  useEffect(() => {
    if (reduced) { setShow(false); return }
    const t = setTimeout(() => setShow(false), 1350)
    return () => clearTimeout(t)
  }, [reduced])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="boot"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="txt">INITIALISING SWARM</div>
          <div className="bar"><i /></div>
          <div className="small">SH-2026-001 · LINKING AGENTS · ESTABLISHING COMMS</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
