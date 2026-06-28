import { sheets } from '../data/content'
import { useActiveSheet } from '../hooks/useActiveSheet'

const ids = sheets.map((s) => s.id)

export default function Nav() {
  const active = useActiveSheet(ids)
  return (
    <nav className="nav" aria-label="Section navigation">
      {sheets.map((s) => (
        <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'active' : ''}>
          <span>{s.no} / {s.label}</span>
          <span className="tick" />
        </a>
      ))}
    </nav>
  )
}
