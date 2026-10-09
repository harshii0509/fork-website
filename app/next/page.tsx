import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import Image from "next/image";
import DownloadButton from "../DownloadButton";
import { CHAPTERS, DOWNLOAD, GITHUB, PROBLEM, REFRAME, SMALL } from "../v2/content";
import { WorkspacesDemo } from "../v2/fork/Demos";
import HelpDemo from "../v2/fork/HelpDemo";
import SeeDemo from "../v2/fork/SeeDemo";
import ForkWindow from "../v2/fork/ForkWindow";
import Footer from "../v2/Footer";
import HeroCover from "../v2/HeroCover";
import HeroSquare from "../v2/HeroSquare";
import Nav from "../v2/Nav";
import Reveals from "../v2/Reveals";
import Agents from "../v2/sections/Agents";
import Bento from "../v2/sections/Bento";
import Chapter from "../v2/sections/Chapter";
import Close from "../v2/sections/Close";
import Faq from "../v2/sections/Faq";
import Letter from "../v2/sections/Letter";
import Reframe from "../v2/sections/Reframe";
import Scatter from "../v2/sections/Scatter";
import Timeline from "../v2/sections/Timeline";
import story from "../v2/story.module.css";
import styles from "../v2/v2.module.css";

// A preview of the home page with its new story below the hero (problem, reframe, chapters, proof), until it
// replaces /. The Fork home page: it explains what Fork does. Section order and jobs come from NARRATIVE in
// v2/content.ts; the look is Fork's own greys, real pieces of the app, and Hairline line figures.

const plex = IBM_Plex_Mono({ weight: ["500", "600", "700"], subsets: ["latin"], variable: "--font-plex" });

export const metadata: Metadata = {
  title: "Fork, the new home page (preview)",
  robots: { index: false, follow: false },
};

export default function Next() {
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
              <Image src="/art/github.svg" width={18} height={18} alt="" aria-hidden className={styles.ghIcon} />
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
        {/* 2 · The problem (push): five windows, one asking you something. */}
        <section id="problem" className={styles.section} aria-labelledby="problem-h">
          <div className={styles.head} data-reveal>
            <h2 id="problem-h" className={styles.h2}>
              {PROBLEM.title}
            </h2>
            <p className={styles.lede}>{PROBLEM.lede}</p>
          </div>
          <div data-reveal>
            <Scatter />
          </div>
        </section>

        {/* 3 · The reframe (push + pull): the terminal today, and in Fork. */}
        <section id="why" className={styles.section} aria-labelledby="why-h">
          <div className={styles.head} data-reveal>
            <h2 id="why-h" className={styles.h2}>
              {REFRAME.title}
            </h2>
            <p className={styles.lede}>{REFRAME.lede}</p>
          </div>
          <Reframe />
        </section>

        {/* 4 · Three chapters (pull), each zooming into one part of the window. */}
        <Chapter id="know" c={CHAPTERS.know}>
          <div className={story.demoCard}>
            <WorkspacesDemo />
          </div>
        </Chapter>
        <Chapter id="see" c={CHAPTERS.see}>
          <SeeDemo />
        </Chapter>
        <Chapter id="learn" c={CHAPTERS.learn}>
          <HelpDemo />
        </Chapter>

        {/* 5 · Settles habit: keep the agent you use. */}
        <section id="agents" className={styles.section} aria-labelledby="agents-h">
          <Agents />
        </section>

        {/* 6 · The small things (pull). */}
        <section id="more" className={styles.section} aria-labelledby="more-h">
          <div className={styles.head} data-reveal>
            <h2 id="more-h" className={styles.h2}>
              {SMALL.title}
            </h2>
            <p className={styles.lede}>{SMALL.lede}</p>
          </div>
          <Bento />
        </section>

        {/* 7 · Proof: every release, read from What's cooking. */}
        <section id="cooking" className={styles.section} aria-labelledby="proof-h">
          <Timeline />
        </section>

        {/* 8 · Trust: a note from the person who made it. */}
        <section id="thanks" className={styles.section} aria-labelledby="thanks-h">
          <div data-reveal>
            <Letter />
          </div>
        </section>

        {/* 9 · Objections, right before the download. */}
        <section id="faq" className={`${styles.section} ${styles.split}`} aria-labelledby="faq-h">
          <h2 id="faq-h" className={styles.h2} data-reveal>
            Questions, before you download.
          </h2>
          <Faq />
        </section>

        {/* 10 · Close. */}
        <section id="download" className={styles.section} aria-labelledby="download-h">
          <Close />
        </section>
      </main>

      {/* 9 · The close: Fork's links as a folder of files, and the word Fork, cut off by the page's edge. */}
      <Footer at="home" />
      <Reveals />
      <HeroCover />
    </div>
  );
}
