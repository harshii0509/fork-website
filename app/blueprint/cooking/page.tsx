import type { Metadata } from "next";
import Figure from "../../v2/hairline/Figure";
import Reveals from "../../v2/Reveals";
import { anchor, chapters, clock, day, type Chapter } from "../../whats-cooking/chapters";
import type { Kind } from "../../whats-cooking/entries";
import { mono, Nav, serif, TitleBlock } from "../Parts";
import Rail from "../Rail";
import styles from "../blueprint.module.css";

// The Blueprint changelog: each release is a sheet of the drawing. Its version number is the drawing itself (the
// numerals figure), a title block says when it was served and what's in it, and its changes are numbered notes,
// each with why it was made. A rail on the left lists every release and marks the one on screen.

export const metadata: Metadata = {
  title: "Changelog · Fork",
  description: "Every change to Fork, release by release, with why it was made.",
  robots: { index: false }, // a direction to compare; the changelog stays at /whats-cooking
};

const KIND: Record<Kind, string> = { new: "New", better: "Better", fixed: "Fixed", kitchen: "Kitchen" };

const count = (c: Chapter, k: Kind) => c.entries.filter((e) => e.kind === k).length;

export default function Changelog() {
  const all = chapters();
  const releases = all.filter((c) => c.version);
  const changes = all.reduce((n, c) => n + c.entries.length, 0);
  const first = releases.at(-1);

  return (
    <div className={`${styles.bp} ${serif.variable} ${mono.variable}`}>
      <Nav away />

      <header id="top" className={`${styles.hero} ${styles.logHero}`}>
        <div className={styles.heroCopy} data-reveal>
          <p className={styles.eyebrow}>
            Changelog · {releases.length} releases · {changes} changes
          </p>
          <h1 className={styles.h1}>
            Every release, <em>drawn</em>.
          </h1>
          <p className={styles.lede}>
            Each version of Fork gets its own sheet, with every change written down and why it was made. Point at a
            number to lift it.
            {first?.at && ` Since ${day(first.at)}.`}
          </p>
        </div>
      </header>

      <main className={styles.logFrame}>
        <Rail
          items={all.map((c) => ({
            id: anchor(c),
            label: c.version ?? "Next",
            note: c.at ? day(c.at) : "on the stove",
          }))}
        />

        <div className={styles.sheets}>
          {all.map((c, i) => (
            <Sheet key={c.key} c={c} n={i + 1} of={all.length} />
          ))}
        </div>
      </main>

      <TitleBlock />
      <Reveals />
    </div>
  );
}

function Sheet({ c, n, of }: { c: Chapter; n: number; of: number }) {
  const id = anchor(c);
  const kinds = (["new", "better", "fixed", "kitchen"] as const).filter((k) => count(c, k));
  return (
    <section id={id} className={styles.sheet} aria-labelledby={`${id}-h`}>
      <div className={styles.sheetHead}>
        {c.version ? (
          <figure className={styles.drawing} data-reveal>
            <Figure name="numerals" digits={c.version} className={styles.figure} label={`Fork ${c.version}, as a drawing: point at a digit and it lifts.`} />
            <figcaption>
              <b>Drawing No. {c.version}</b> Point at a digit.
            </figcaption>
          </figure>
        ) : (
          <div className={`${styles.drawing} ${styles.pending}`} data-reveal>
            <p>Not served yet</p>
            <small>These changes go out with the next release. Its drawing comes with it.</small>
          </div>
        )}

        <dl className={styles.block} data-reveal>
          <div className={styles.blockWide}>
            <dt>Release</dt>
            <dd id={`${id}-h`}>{c.version ? `Fork ${c.version}` : "On the stove"}</dd>
          </div>
          <div>
            <dt>Served</dt>
            <dd>{c.at ? `${day(c.at)}, ${clock(c.at)}` : "Not yet"}</dd>
          </div>
          <div>
            <dt>Changes</dt>
            <dd>{c.entries.length}</dd>
          </div>
          <div>
            <dt>Of which</dt>
            <dd>{kinds.map((k) => `${count(c, k)} ${KIND[k].toLowerCase()}`).join(" · ")}</dd>
          </div>
          <div>
            <dt>Sheet</dt>
            <dd>
              {n} of {of}
            </dd>
          </div>
        </dl>
      </div>

      <ol className={styles.sheetNotes}>
        {c.entries.map((e, k) => (
          <li key={e.at + e.title} data-reveal>
            <span className={styles.noteNo}>{String(k + 1).padStart(2, "0")}</span>
            <div>
              <p className={styles.noteMeta}>
                <span data-kind={e.kind}>{KIND[e.kind]}</span> · {e.where} · {day(e.at)}
                {e.at.includes("T") && `, ${clock(e.at)}`}
              </p>
              <h3 className={styles.noteTitle}>{e.title}</h3>
              <p className={styles.noteWhat}>{e.what}</p>
              <details className={styles.why}>
                <summary>Why</summary>
                <p>{e.why}</p>
              </details>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
