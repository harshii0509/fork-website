import { LANDING } from "../content";
import s from "./mac.module.css";
import Window from "./Window";

// A note from the maker, in a "notes" window, over a soft arc of Fork's squares.
const ARC = Array.from({ length: 23 }, (_, i) => {
  const t = i / 22; // 0 → 1 across the arc
  const x = (t - 0.5) * 2; // −1 → 1
  return { left: `${t * 100}%`, top: `${x * x * 78}%`, hue: 330 + t * 120, i };
});

export default function Notes() {
  const n = LANDING.notes;
  return (
    <section id="notes" className={s.notes} aria-labelledby="notes-h">
      <p className={s.pill}>the dream</p>
      <div className={s.arc} aria-hidden>
        {ARC.map((a) => (
          <i key={a.i} style={{ left: a.left, top: a.top, ["--h" as string]: (a.hue % 360).toFixed(0) }} />
        ))}
      </div>
      <div data-reveal>
        <Window tint="sand" title="notes" className={s.noteWin}>
          <div className={s.note}>
            <h2 id="notes-h" className={s.srOnly}>
              A note from the maker
            </h2>
            <p>
              {n.lines[0]} <mark>{n.lines[1]}</mark> {n.lines[2]}
            </p>
            <p>{n.after}</p>
            <footer className={s.sign}>
              <span>
                <b>{n.name}</b>
                <small>{n.role}</small>
              </span>
              <span className={s.scribble}>Fork</span>
            </footer>
          </div>
        </Window>
      </div>
    </section>
  );
}
