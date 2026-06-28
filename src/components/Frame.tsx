import StatusStrip from './StatusStrip'

/** Fixed CAD drawing frame, title block and live status strip. */
export default function Frame() {
  return (
    <>
      <div className="frame" aria-hidden="true">
        <span className="frame-corner tl" />
        <span className="frame-corner tr" />
        <span className="frame-corner bl" />
        <span className="frame-corner br" />
      </div>

      <StatusStrip />

      <aside className="titleblock" aria-hidden="true">
        <div>DWG. NO. <b>SH-2026-001</b></div>
        <div>TITLE: <b>AUTONOMY ENGINEER</b></div>
        <div>SCALE 1:1 · A1 · SHEET 1/6</div>
        <div>DRAWN: <b>S.M.H. HAJKARIM</b></div>
      </aside>
    </>
  )
}
