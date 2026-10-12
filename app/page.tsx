import { IconGithub } from "@central-icons-react/round-outlined-radius-2-stroke-1.5/IconGithub";
import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import DownloadButton from "./DownloadButton";
import { ENTRIES, STICKER } from "./whats-cooking/entries";
import { DOWNLOAD, GITHUB, MORE_HOME } from "./v2/content";
import { DesignDemo, WorkspacesDemo } from "./v2/fork/Demos";
import ForkWindow from "./v2/fork/ForkWindow";
import Footer from "./v2/Footer";
import Figure from "./v2/hairline/Figure";
import HeroCover from "./v2/HeroCover";
import HeroSquare from "./v2/HeroSquare";
import Nav from "./v2/Nav";
import Reveals from "./v2/Reveals";
import Download from "./v2/sections/Download";
import Faq from "./v2/sections/Faq";
import styles from "./v2/v2.module.css";

// The Fork home page: it explains what Fork does. Section order and jobs come from NARRATIVE in
// v2/content.ts; the look is Fork's own greys, real pieces of the app, and Hairline line figures.

const plex = IBM_Plex_Mono({ weight: ["500", "600", "700"], subsets: ["latin"], variable: "--font-plex" });

export const metadata: Metadata = {
  title: "Fork, a terminal for people who build things",
  description:
    "Every project in its own tab, a square that tells you when an agent needs you, and your app, its changes and its design system right beside the terminal.",
};

export default function Home() {
  const cooked = ENTRIES.filter((e) => e.where === "app").slice(0, 3);
  return (
    <div className={`${styles.v2} ${plex.variable}`}>
      <Nav brandClass={plex.className} />

      {/* 1 · Hook */}
      <header id="top" className={styles.hero} data-cover>
        <div className={styles.heroCopy} data-cover-copy>
          <p className={`${styles.heroEyebrow} ${plex.className}`}>
            Meet <HeroSquare /> Fork
          </p>
          <h1 className={`${styles.h1} ${styles.heroTitle}`}>The terminal that tells you when an agent needs&nbsp;you.</h1>
          <p className={styles.heroLede}>
            Every project gets its own tab, with your app, its changes and its design system right beside the terminal.
          </p>
          <div className={styles.ctas}>
            <DownloadButton href={DOWNLOAD} from="top" className={styles.btnPrimary} />
            <a className={styles.btnSoft} href={GITHUB} target="_blank" rel="noopener noreferrer" data-track="github_clicked" data-from="top">
              <IconGithub size={18} mode="raw" className={styles.ghIcon} />
              View on GitHub
            </a>
          </div>
          <p className={styles.micro}>Free · for Macs with Apple Silicon</p>
        </div>

        <div className={styles.heroStage} data-cover-stage>
          <div className={styles.heroWindow}>
            <ForkWindow play label="The Fork window: three workspaces as tabs, a terminal where an agent makes the hero calmer, and the panel showing the page before and after." />
          </div>
        </div>
      </header>

      <main>
        {/* 2 · Insight (push) */}
        <section id="insight" className={styles.section} aria-labelledby="insight-h">
          <div className={styles.insight} data-reveal>
            <div className={styles.insightCopy}>
              <h2 id="insight-h" className={styles.h2}>
                You started three agents. Which one is waiting on you?
              </h2>
              <p className={styles.lede}>
                Agents work in terminals you can’t see. One finished ten minutes ago, one is stuck on a question, and you
                only find out by clicking through every window.
              </p>
              <p className={styles.lede}>
                <b>Fork gives every project its own tab, and the tab tells you.</b>
              </p>
            </div>
            <Figure name="tabs" className={styles.insightFigure} intensity={0.6} label="Five workspace tabs: the one you point at lifts, and its square splits into a lattice, the sign that it’s working." />
          </div>
        </section>

        {/* 3 · Value: workspaces */}
        <section id="workspaces" className={styles.section} aria-labelledby="workspaces-h">
          <div className={styles.head} data-reveal>
            <h2 id="workspaces-h" className={styles.h2}>
              One tab per project. One square that tells you.
            </h2>
            <p className={styles.lede}>
              The square on each workspace’s tab is its status. Work in one project and still see the others.
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureMain} data-reveal>
              <WorkspacesDemo />
            </div>
            <div className={styles.featureSide} data-reveal style={{ "--i": 1 } as React.CSSProperties}>
              <Figure name="folders" className={styles.figure} label="Four folders on a shelf, each holding a terminal: the one you point at opens and its window slides up." />
              <h3 className={styles.h3}>A workspace is a folder</h3>
              <p>
                Open a folder once. Its terminals, files, search and changes stay together in that tab, wherever your
                terminals go.
              </p>
            </div>
          </div>
        </section>

        {/* 4 · Value: design */}
        <section id="design" className={styles.section} aria-labelledby="design-h">
          <div className={styles.head} data-reveal>
            <h2 id="design-h" className={styles.h2}>
              Your design system, live beside the terminal.
            </h2>
            <p className={styles.lede}>
              The Design tab reads colours, type, spacing and radii from your project’s own files, and redraws when an
              agent changes one. Click a token to copy it.
            </p>
          </div>
          <div className={`${styles.feature} ${styles.featureFlip}`}>
            <div className={styles.featureSide} data-reveal>
              <Figure name="swatchfan" className={styles.figure} label="A swatch deck of your project’s colours: point at a chip and it swings out." />
              <h3 className={styles.h3}>Light and dark, side by side</h3>
              <p>
                A project with a dark theme shows both values for every colour, so you see what an agent’s change does to
                each.
              </p>
            </div>
            <div className={styles.featureMain} data-reveal style={{ "--i": 1 } as React.CSSProperties}>
              <DesignDemo />
            </div>
          </div>
        </section>

        {/* 5 · Value: the rest */}
        <section id="more" className={styles.section} aria-labelledby="more-h">
          <div className={styles.head} data-reveal>
            <h2 id="more-h" className={styles.h2}>
              Also in Fork.
            </h2>
            <p className={styles.lede}>The smaller things that make a terminal friendlier.</p>
          </div>
          <div className={styles.moreGrid}>
            {MORE_HOME.map((m, i) => (
              <article key={m.id} className={styles.moreCard} data-reveal style={{ "--i": i } as React.CSSProperties}>
                <Figure name={m.figure} className={styles.moreFigure} label={m.title} />
                <h3 className={styles.h3}>{m.title}</h3>
                <p>{m.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 6 · Proof */}
        <section id="cooking" className={styles.section} aria-labelledby="cooking-h">
          <div className={styles.head} data-reveal>
            <h2 id="cooking-h" className={styles.h2}>
              Cooked in the open.
            </h2>
            <p className={styles.lede}>Every change to Fork gets written down, with why it was made.</p>
          </div>
          <div className={styles.cooked}>
            {cooked.map((e, i) => (
              <Link key={e.at + e.title} href="/whats-cooking" className={styles.cookCard} data-reveal style={{ "--i": i } as React.CSSProperties} data-track="cooking_clicked" data-from="cooking">
                <span className={styles.sticker} data-kind={e.kind}>
                  {e.version ? STICKER[e.kind] : "On the stove"}
                </span>
                <b>{e.title}</b>
                <p>{e.what}</p>
                <time dateTime={e.at}>
                  {new Date(e.at).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" })}
                </time>
              </Link>
            ))}
          </div>
          <p className={styles.more} data-reveal>
            <Link href="/whats-cooking" data-track="cooking_clicked" data-from="cooking-more">
              See everything that’s cooking →
            </Link>
          </p>
        </section>

        {/* 7 · Objections */}
        <section id="faq" className={`${styles.section} ${styles.split}`} aria-labelledby="faq-h">
          <h2 id="faq-h" className={styles.h2} data-reveal>
            Questions, before you download.
          </h2>
          <Faq />
        </section>

        {/* 8 · Close */}
        <section id="download" className={`${styles.section} ${styles.split}`} aria-labelledby="download-h">
          <div data-reveal>
            <h2 id="download-h" className={styles.h2}>
              Download Fork.
            </h2>
            <p className={styles.lede}>Free, for Macs with Apple Silicon. Your workspaces come back after every update.</p>
          </div>
          <Download />
        </section>
      </main>

      {/* 9 · The close: Fork's links as a folder of files, and the word Fork, cut off by the page's edge. */}
      <Footer at="home" />
      <Reveals />
      <HeroCover />
    </div>
  );
}
