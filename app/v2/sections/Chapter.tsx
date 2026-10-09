import type { CSSProperties, ReactNode } from "react";
import type { Chapter as C } from "../content";
import s from "../story.module.css";
import v from "../v2.module.css";

// One numbered chapter: a rule, its number and name, the title with its lede beside it, then the demo with
// three short notes. Every chapter has the same shape, so the demos are what changes.
export default function Chapter({ id, c, children }: { id: string; c: C; children: ReactNode }) {
  return (
    <section id={id} className={s.chapter} aria-labelledby={`${id}-h`}>
      <div className={s.chHead} data-reveal>
        <p className={s.chNum}>
          <b>{c.n}</b>
          {c.label}
        </p>
        <h2 id={`${id}-h`} className={v.h2}>
          {c.title}
        </h2>
        <p className={`${v.lede} ${s.chLede}`}>{c.lede}</p>
      </div>
      <div className={s.chBody}>
        <div data-reveal>{children}</div>
        <ul className={s.notes}>
          {c.notes.map(([b, p], i) => (
            <li key={b} data-reveal style={{ "--i": i + 1 } as CSSProperties}>
              <b>{b}</b>
              <p>{p}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
