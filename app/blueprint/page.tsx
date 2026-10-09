import type { Metadata } from "next";
import Link from "next/link";
import DownloadButton from "../DownloadButton";
import CopyButton from "../v2/CopyButton";
import { DOWNLOAD, INSTALL_CMD, MORE, SECTIONS } from "../v2/content";
import { DesignDemo, WorkspacesDemo } from "../v2/fork/Demos";
import ForkWindow from "../v2/fork/ForkWindow";
import Figure from "../v2/hairline/Figure";
import Reveals from "../v2/Reveals";
import { chapters, clock, day } from "../whats-cooking/chapters";
import { STICKER } from "../whats-cooking/entries";
import { Looks, Questions } from "./Bits";
import { Label, mono, Nav, serif, Title, TitleBlock } from "./Parts";
import styles from "./blueprint.module.css";

// Direction A, "Blueprint": the home page as a technical drawing. Drafting paper (a real blueprint in dark mode),
// the page's grid drawn as hairlines, numbered cells, mono notes, serif headlines, and every picture captioned as a
// figure. Same story as the other direction (SECTIONS and NARRATIVE in v2/content.ts).

export const metadata: Metadata = {
  title: "Fork, a terminal that tells you when an agent is done",
  description: SECTIONS.top.lede,
  robots: { index: false }, // a direction to compare; the home page stays at /
};

export default function Blueprint() {
  const S = SECTIONS;
  const latest = chapters().flatMap((c) => c.entries).slice(0, 4);
  const rev = chapters().find((c) => c.version);
  return (
    <div className={`${styles.bp} ${serif.variable} ${mono.variable}`}>
      <Nav />

      <header id="top" className={styles.hero}>
        <div className={styles.heroCopy} data-reveal>
          <p className={styles.eyebrow}>
            {S.top.eyebrow} · v{rev?.version}
          </p>
          <Title s={S.top} as="h1" />
          <p className={styles.lede}>{S.top.lede}</p>
          <div className={styles.ctas}>
            <DownloadButton href={DOWNLOAD} from="top" className={styles.btn} />
            <div className={styles.cmd}>
              <code>{INSTALL_CMD}</code>
              <CopyButton text={INSTALL_CMD} event="install_copied" label="Copy the install command" className={styles.copy} />
            </div>
          </div>
        </div>
        <figure className={styles.heroFig} data-reveal>
          <div className={styles.dims} aria-hidden>
            <span>1280</span>
          </div>
          <div className={styles.dimsV} aria-hidden>
            <span>800</span>
          </div>
          <ForkWindow play label="The Fork window: three workspaces as tabs, an agent making a page calmer in the terminal, and the panel showing the page before and after." />
          <figcaption>
            <b>fig. 1</b> Fork, mid-turn: an agent makes the hero calmer, and the panel shows the page before and after.
          </figcaption>
        </figure>
      </header>

      <main>
        <section id="insight" className={styles.cell} aria-labelledby="insight-h">
          <Label n={1} s={S.insight} />
          <div className={styles.split}>
            <div data-reveal>
              <Title s={S.insight} />
              <p className={styles.lede}>{S.insight.lede}</p>
            </div>
            <figure className={styles.fig} data-reveal>
              <Figure name="tabs" className={styles.figure} intensity={0.6} label="Five workspace tabs: the one you point at lifts, and its square splits into a lattice, the sign that it’s working." />
              <figcaption>
                <b>fig. 2</b> Workspace tabs. Point at one.
              </figcaption>
            </figure>
          </div>
        </section>

        <section id="workspaces" className={styles.cell} aria-labelledby="workspaces-h">
          <Label n={2} s={S.workspaces} />
          <div className={styles.stack}>
            <div className={styles.intro} data-reveal>
              <Title s={S.workspaces} />
              <p className={styles.lede}>{S.workspaces.lede}</p>
            </div>
            <div className={styles.pair}>
              <figure className={styles.plate} data-reveal>
                <WorkspacesDemo />
                <figcaption>
                  <b>fig. 3</b> The square, through an afternoon.
                </figcaption>
              </figure>
              <figure className={styles.fig} data-reveal>
                <Figure name="folders" className={styles.figure} label="Four folders on a shelf, each holding a terminal: the one you point at opens and its window slides up." />
                <figcaption>
                  <b>fig. 4</b> A workspace is a folder.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section id="design" className={styles.cell} aria-labelledby="design-h">
          <Label n={3} s={S.design} />
          <div className={styles.stack}>
            <div className={styles.intro} data-reveal>
              <Title s={S.design} />
              <p className={styles.lede}>{S.design.lede}</p>
            </div>
            <div className={`${styles.pair} ${styles.flip}`}>
              <figure className={styles.fig} data-reveal>
                <Figure name="swatchfan" className={styles.figure} label="A swatch deck of your project’s colours: point at a chip and it swings out." />
                <figcaption>
                  <b>fig. 5</b> Your colours, as a swatch deck.
                </figcaption>
              </figure>
              <figure className={styles.plate} data-reveal>
                <DesignDemo />
                <figcaption>
                  <b>fig. 6</b> The Design tab following an agent’s edits.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section id="more" className={styles.cell} aria-labelledby="more-h">
          <Label n={4} s={S.more} />
          <div className={styles.stack}>
            <div className={styles.intro} data-reveal>
              <Title s={S.more} />
            </div>
            <div className={styles.four}>
              {MORE.map((m, i) => (
                <article key={m.id} data-reveal style={{ "--i": i } as React.CSSProperties}>
                  <Figure name={m.figure} className={styles.figure} label={m.title} />
                  <p className={styles.figNo}>fig. {7 + i}</p>
                  <h3 className={styles.h3}>{m.title}</h3>
                  <p>{m.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="yours" className={styles.cell} aria-labelledby="yours-h">
          <Label n={5} s={S.yours} />
          <div className={styles.stack}>
            <div className={styles.intro} data-reveal>
              <Title s={S.yours} />
              <p className={styles.lede}>{S.yours.lede}</p>
            </div>
            <div className={styles.looks} data-reveal>
              <Looks />
            </div>
          </div>
        </section>

        <section id="cooking" className={styles.cell} aria-labelledby="cooking-h">
          <Label n={6} s={S.cooking} />
          <div className={styles.split}>
            <div data-reveal>
              <Title s={S.cooking} />
              <p className={styles.lede}>{S.cooking.lede}</p>
              <Link className={styles.more} href="/blueprint/cooking" data-track="cooking_clicked" data-from="cooking-more">
                Every change, release by release →
              </Link>
            </div>
            <ol className={styles.notes} data-reveal>
              {latest.map((e) => (
                <li key={e.at + e.title}>
                  <span className={styles.noteMeta}>
                    {day(e.at)} · {clock(e.at)} · {e.version ? `in ${e.version}` : STICKER[e.kind]}
                  </span>
                  <b>{e.title}</b>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="faq" className={styles.cell} aria-labelledby="faq-h">
          <Label n={7} s={S.faq} />
          <div className={styles.split}>
            <div data-reveal>
              <Title s={S.faq} />
            </div>
            <div data-reveal>
              <Questions />
            </div>
          </div>
        </section>

        <section id="download" className={`${styles.cell} ${styles.download}`} aria-labelledby="download-h">
          <Label n={8} s={S.download} />
          <div className={styles.split}>
            <div data-reveal>
              <Title s={S.download} />
              <p className={styles.lede}>{S.download.lede}</p>
            </div>
            <div className={styles.dl} data-reveal>
              <DownloadButton href={DOWNLOAD} from="download" className={styles.btnBig} />
              <div className={styles.cmd}>
                <code>{INSTALL_CMD}</code>
                <CopyButton text={INSTALL_CMD} event="install_copied" label="Copy the install command" className={styles.copy} />
              </div>
            </div>
          </div>
        </section>

        <section id="thanks" className={styles.cell} aria-labelledby="thanks-h">
          <Label n={9} s={S.thanks} />
          <div className={styles.split}>
            <div data-reveal>
              <Title s={S.thanks} />
              <p className={styles.lede}>{S.thanks.lede}</p>
              <p className={styles.credit}>
                Line drawings: <a href="https://hairline.lucasmarkes.com" target="_blank" rel="noopener noreferrer">Hairline</a>, by Lucas Marques.
              </p>
            </div>
            <figure className={styles.fig} data-reveal>
              <Figure name="laptop" className={styles.figure} intensity={0.6} label="A thin laptop: point higher and the lid opens wider." />
              <figcaption>
                <b>fig. 11</b> Where it was made.
              </figcaption>
            </figure>
          </div>
        </section>
      </main>

      <TitleBlock />
      <Reveals />
    </div>
  );
}
