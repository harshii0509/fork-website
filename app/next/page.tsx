import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import Image from "next/image";
import DownloadButton from "../DownloadButton";
import { DOWNLOAD, GITHUB } from "../v2/content";
import ForkWindow from "../v2/fork/ForkWindow";
import Footer from "../v2/Footer";
import HeroCover from "../v2/HeroCover";
import HeroSquare from "../v2/HeroSquare";
import Nav from "../v2/Nav";
import Reveals from "../v2/Reveals";
import Close from "../v2/sections/Close";
import Faq from "../v2/sections/Faq";
import { BreaksPart, ChangesPart, ProblemPart, WorkspacesPart } from "../v2/sections/Parts";
import Proof from "../v2/sections/Proof";
import story from "../v2/story.module.css";
import styles from "../v2/v2.module.css";

// A preview of the home page with its new sections below the hero, in Linear's way (a heading and one line,
// then a figure whose list drives the product), until it replaces /. The Fork home page: it explains what Fork does. Section order and jobs come from NARRATIVE in
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
        {/* 1.0 to 4.0: Linear's shape. A heading and one line, then a figure whose list drives the product. */}
        <ProblemPart />
        <WorkspacesPart />
        <ChangesPart />
        <BreaksPart />

        {/* 5.0 and 6.0: two quiet cards, then numbers and the maker's own words. */}
        <Proof />

        {/* Objections, right before the download. */}
        <section id="faq" className={`${styles.section} ${styles.split}`} aria-labelledby="faq-h">
          <h2 id="faq-h" className={story.title} data-reveal>
            Questions
          </h2>
          <Faq />
        </section>

        <Close />
      </main>

      {/* 9 · The close: Fork's links as a folder of files, and the word Fork, cut off by the page's edge. */}
      <Footer at="home" />
      <Reveals />
      <HeroCover />
    </div>
  );
}
