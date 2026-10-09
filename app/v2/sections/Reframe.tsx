import type { CSSProperties, ReactNode } from "react";
import { REFRAME } from "../content";
import f from "../fork/fork.module.css";
import Square from "../fork/Square";
import s from "../story.module.css";

// Why Fork and not the terminal you have: five rows, today on the left, Fork on the right, and on each Fork side
// the small piece of the app that does it, so every claim has something real next to it.

const PIECES: Record<(typeof REFRAME.rows)[number]["id"], ReactNode> = {
  status: (
    <span className={s.piece}>
      <Square s="needs" color="var(--ws-1)" />
      portfolio
    </span>
  ),
  changes: (
    <span className={s.ba} aria-hidden>
      <i />
      <i />
    </span>
  ),
  errors: (
    <span className={s.piece}>
      <span className={s.oopsDot} />
      What went wrong?
    </span>
  ),
  trash: <span className={s.piece}>Moved to the Trash</span>,
  words: (
    <span className={`${s.piece} ${s.pieceMono}`}>
      up a folder <span className={s.mute}>→</span> cd ..
    </span>
  ),
};

export default function Reframe() {
  return (
    <div className={`${f.fork} ${s.reframe}`} role="table" aria-label={REFRAME.title}>
      <div className={`${s.rfRow} ${s.rfHead}`} role="row">
        <div className={s.rfToday} role="columnheader">
          {REFRAME.today}
        </div>
        <div className={s.rfFork} role="columnheader">
          {REFRAME.fork}
        </div>
      </div>
      {REFRAME.rows.map((r, i) => (
        <div key={r.id} className={s.rfRow} role="row" data-reveal style={{ "--i": i } as CSSProperties}>
          <div className={s.rfToday} role="cell">
            {r.today}
          </div>
          <div className={s.rfFork} role="cell">
            <span className={s.chipCell} aria-hidden>
              {PIECES[r.id]}
            </span>
            <span>{r.fork}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
