import type { Metadata } from "next";
import Reveals from "../../v2/Reveals";
import { anchor, chapters, clock, day } from "../../whats-cooking/chapters";
import Changelog from "../Changelog";
import { Bar, Cmd, mono, Wordmark } from "../Parts";
import styles from "../terminal.module.css";

// The Terminal changelog: the page reads as `fork changelog`. Each release opens with its version number drawn
// in light lines (the numerals figure), then its changes print as log lines that open like --verbose.

export const metadata: Metadata = {
  title: "Changelog · Fork",
  description: "Every change to Fork, release by release, with why it was made.",
  robots: { index: false }, // a direction to compare; the changelog stays at /whats-cooking
};

export default function TerminalChangelog() {
  const all = chapters();
  const releases = all.filter((c) => c.version);
  const changes = all.reduce((n, c) => n + c.entries.length, 0);
  const first = releases.at(-1);
  const data = all.map((c) => ({
    id: anchor(c),
    version: c.version,
    served: c.at ? `${day(c.at)} ${clock(c.at)}` : null,
    lines: c.entries.map((e, i) => ({
      id: `${anchor(c)}-${i}`,
      kind: e.kind,
      where: e.where,
      when: e.at.includes("T") ? `${day(e.at)} ${clock(e.at)}` : day(e.at),
      title: e.title,
      what: e.what,
      why: e.why,
    })),
  }));

  return (
    <div className={`${styles.t} ${mono.variable}`}>
      <Bar title="fork · changelog · zsh" away />

      <main className={styles.session}>
        <Cmd cmd="fork changelog --help" id="top" className={styles.hero}>
          <p className={styles.meta}>
            {releases.length} releases · {changes} changes{first?.at && ` · since ${day(first.at)}`}
          </p>
          <h1 id="top-h" className={styles.h1}>
            Every change, <em>release by release</em>.
          </h1>
          <p className={styles.lede}>
            Each release starts with its number, drawn. Open a line for what changed and why. The flags filter what
            prints.
          </p>
          <ul className={styles.legend} aria-label="What the marks mean">
            <li data-kind="new">+ new</li>
            <li data-kind="better">~ better</li>
            <li data-kind="fixed">! fixed</li>
            <li data-kind="kitchen"># kitchen, behind the scenes</li>
          </ul>
        </Cmd>

        <Changelog chapters={data} />
      </main>

      <Wordmark />
      <Reveals />
    </div>
  );
}
