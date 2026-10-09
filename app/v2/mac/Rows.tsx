import { LANDING } from "../content";
import Bubble from "./Bubble";
import Clip from "./Clip";
import s from "./mac.module.css";
import Window from "./Window";

// One row per feature: a chat bubble, a small title and one line on one side, and a big window playing the
// real thing on the other. Sides swap every row.
export default function Rows() {
  return (
    <section className={s.rows} aria-label="What Fork does">
      {LANDING.rows.map((r, i) => (
        <article key={r.id} id={r.id} className={s.row} data-flip={i % 2 ? "" : undefined}>
          <div className={s.rowCopy} data-reveal>
            <Bubble text={r.bubble} />
            <h2 className={s.rowTitle}>{r.title}</h2>
            <p className={s.rowLine}>{r.line}</p>
          </div>
          <div data-reveal>
            <Window tint={r.tint} title="Fork">
              <Clip name={r.clip} label={r.label} />
            </Window>
          </div>
        </article>
      ))}
    </section>
  );
}
