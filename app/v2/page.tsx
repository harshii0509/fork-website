import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import CookingNote from "../CookingNote";
import DownloadButton from "../DownloadButton";
import Footer from "../Footer";
import ForkApp from "../ForkApp";
import NoodleBowl from "../NoodleBowl";
import Snowman from "../Snowman";
import { ENTRIES, STICKER } from "../whats-cooking/entries";
import Bloub from "./Bloub";
import { DOWNLOAD, FEATURES, GITHUB } from "./content";
import Nav from "./Nav";
import Reveals from "./Reveals";
import ClaudeCode from "./sections/ClaudeCode";
import Download from "./sections/Download";
import Faq from "./sections/Faq";
import { CmdKDemo, NudgeDemo, OopsDemo, SeeDemo } from "./sections/FeatureDemos";
import InsightBlob from "./sections/InsightBlob";
import Themes from "./sections/Themes";
import WhileYouWait from "./sections/WhileYouWait";
import ShaderPanel from "./ShaderPanel";
import styles from "./v2.module.css";

// The Fork landing page, take two: it explains what Fork does. Section order and jobs come from
// NARRATIVE in content.ts; the look is cream paper, flat panels, and colour only from shaders.

const plex = IBM_Plex_Mono({ weight: ["500", "700"], subsets: ["latin"], variable: "--font-plex" });

export const metadata: Metadata = {
  title: "Fork, a terminal for people who build things",
  description: "Say what you want in plain words, understand every error, and see Claude Code working right beside you.",
  robots: { index: false, follow: true }, // until it replaces the home page
};

const DEMOS = { cmdk: CmdKDemo, oops: OopsDemo, nudge: NudgeDemo, see: SeeDemo };

// Each feature card's shader: one quiet colour field per card, all from the same palette.
const CARD_SHADERS = {
  cmdk: {
    shader: "GrainGradient",
    base: "#E6DDF7",
    params: { colorBack: "#EFE9FB", colors: ["#7C6CFF", "#B8AEFF", "#F2D58E"], softness: 0.8, intensity: 0.3, noise: 0.35, shape: "corners", speed: 0.6 },
  },
  oops: {
    shader: "Dithering",
    base: "#F4E4E8",
    params: { colorBack: "#F6ECEE", colorFront: "#E7A3B6", shape: "warp", type: "4x4", size: 3, speed: 0.5 },
  },
  nudge: {
    shader: "DotGrid",
    base: "#EDE7DA",
    params: { colorBack: "#EDE7DA", colorFill: "#CFC4AE", colorStroke: "#CFC4AE", size: 2, gapX: 18, gapY: 18, strokeWidth: 0, sizeRange: 0.4, opacityRange: 0.5, shape: "circle" },
  },
  see: {
    shader: "PaperTexture",
    base: "#EADFC8",
    params: { colorBack: "#EADFC8", colorPaper: "#F7F1E4", colorShadow: "#C9B998", fit: "cover", scale: 1, roughness: 0.4, fiber: 0.3, folds: 0.5, crumples: 0.3, drops: 0.1, seed: 5.8 },
  },
} as const;

function Doodle({ src, width, height, className }: { src: string; width: number; height: number; className: string }) {
  return <Image src={src} width={width} height={height} alt="" aria-hidden className={`${styles.doodle} ${className}`} />;
}

export default function V2() {
  const cooked = ENTRIES.filter((e) => e.where === "app").slice(0, 3);
  return (
    <div className={`${styles.v2} ${plex.variable}`}>
      <Nav brandClass={plex.className} />

      {/* 1 · Hook */}
      <header id="top" className={styles.hero}>
        <div className={styles.heroCopy}>
          <NoodleBowl className={styles.heroBowl} />
          <Doodle src="/art/Fork.svg" width={62} height={83} className={styles.heroFork} />
          <h1 className={styles.h1}>
            Meet <Bloub size={64} gaze className={styles.h1Blob} label="Fork’s blob" /> Fork
          </h1>
          <p className={styles.heroLede}>
            A terminal for people who build things. Say what you want in plain words, and watch Claude Code work right
            beside you.
          </p>
          <div className={styles.ctas}>
            <DownloadButton href={DOWNLOAD} from="top" className={styles.btnPrimary} />
            <a className={styles.btnSoft} href={GITHUB} target="_blank" rel="noopener noreferrer" data-track="github_clicked" data-from="top">
              <Image src="/art/github.svg" width={18} height={18} alt="" aria-hidden />
              View on GitHub
            </a>
          </div>
          <p className={styles.micro}>Free · for Macs with Apple Silicon</p>
        </div>

        <ShaderPanel
          shader="GrainGradient"
          base="#E4DAC6"
          className={styles.heroStage}
          steer={0.1}
          params={{
            colorBack: "#E9E1D1",
            colors: ["#7C6CFF", "#D5567D", "#F2D58E"],
            softness: 0.9,
            intensity: 0.22,
            noise: 0.28,
            shape: "blob",
            speed: 0.35,
            scale: 1.3,
          }}
        >
          <div className={styles.heroWindow}>
            <ForkApp className={styles.heroApp} />
            <CookingNote className={styles.flatNote} />
          </div>
        </ShaderPanel>
      </header>

      <main>
        {/* 2 · Insight (push) */}
        <section id="insight" className={styles.section} aria-labelledby="insight-h">
          <div className={styles.insight} data-reveal>
            <div className={styles.insightCopy}>
              <h2 id="insight-h" className={styles.h2}>
                A terminal is a chat with your computer. It just never learned to talk back.
              </h2>
              <p className={styles.lede}>
                You type commands you had to look up. When something breaks, you get a wall of red. And while Claude
                works, you watch a spinner, never quite sure if it’s done.
              </p>
              <p className={styles.lede}>
                <b>Fork runs your own shell and your own setup, and gives it a friendlier face.</b>
              </p>
            </div>
            <InsightBlob />
          </div>
        </section>

        {/* 3 · Value: what it does */}
        <section id="features" className={styles.section} aria-labelledby="features-h">
          <div className={styles.head} data-reveal>
            <h2 id="features-h" className={styles.h2}>
              Fork does the typing for you.
            </h2>
            <p className={styles.lede}>
              You say what you want. Fork finds the command, explains the error, and suggests the next step.
            </p>
          </div>
          <div className={styles.cards}>
            {FEATURES.map((f) => {
              const Demo = DEMOS[f.id];
              const s = CARD_SHADERS[f.id];
              return (
                <article key={f.id} className={styles.card} data-reveal>
                  <div className={styles.cardCopy}>
                    <h3 className={styles.h3}>{f.title}</h3>
                    <p>{f.body}</p>
                  </div>
                  <ShaderPanel shader={s.shader} base={s.base} params={s.params} className={styles.cardStage}>
                    <Demo />
                  </ShaderPanel>
                </article>
              );
            })}
          </div>
        </section>

        {/* 4 · Value: the aha */}
        <section id="claude" className={styles.section} aria-label="Built around Claude Code">
          <ClaudeCode />
        </section>

        {/* 5 · Value: retention */}
        <section id="wait" className={styles.section} aria-labelledby="wait-h">
          <div className={styles.head} data-reveal>
            <h2 id="wait-h" className={styles.h2}>
              Something to do while Claude works.
            </h2>
            <p className={styles.lede}>
              Snake, Stack and Space Run open in a split beside the terminal. When Claude finishes, the game pauses and
              tells you. Try it: this one’s real.
            </p>
          </div>
          <WhileYouWait />
        </section>

        {/* 6 · Value: make it yours */}
        <section id="yours" className={styles.section} aria-labelledby="yours-h">
          <div className={styles.head} data-reveal>
            <h2 id="yours-h" className={styles.h2}>
              27 themes. Your fonts. Light, dark, or follow the Mac.
            </h2>
            <p className={styles.lede}>Everything in Fork takes its colours from your theme, down to the blobs.</p>
          </div>
          <Themes />
        </section>

        {/* 7 · Proof */}
        <section id="cooking" className={styles.section} aria-labelledby="cooking-h">
          <div className={styles.head} data-reveal>
            <h2 id="cooking-h" className={styles.h2}>
              Cooked in the open.
            </h2>
            <p className={styles.lede}>Every change to Fork gets written down, with why it was made.</p>
          </div>
          <div className={styles.cooked}>
            {cooked.map((e, i) => (
              <Link key={e.at} href="/whats-cooking" className={styles.cookCard} data-reveal style={{ "--i": i } as React.CSSProperties} data-track="cooking_clicked" data-from="cooking">
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

        {/* 8 · Objections */}
        <section id="faq" className={`${styles.section} ${styles.split}`} aria-labelledby="faq-h">
          <h2 id="faq-h" className={styles.h2} data-reveal>
            Questions, before you download.
          </h2>
          <Faq />
        </section>

        {/* 9 · Close */}
        <section id="download" className={`${styles.section} ${styles.split}`} aria-labelledby="download-h">
          <div data-reveal>
            <h2 id="download-h" className={styles.h2}>
              Download Fork.
            </h2>
            <p className={styles.lede}>Free, for Macs with Apple Silicon. Your tabs come back after every update.</p>
          </div>
          <Download />
        </section>

        {/* 10 · Who made this */}
        <section id="thanks" className={styles.thanks} aria-labelledby="thanks-h">
          <Snowman />
          <h2 id="thanks-h" className={styles.note}>
            Thanks a ton!
          </h2>
          <p className={styles.bio}>
            I’m Harshvardhan. I spend my days in terminals, and I wanted one that felt faster when I need it, calmer when
            I’m juggling a dozen things, and a little more human when I’m figuring things out. So I made Fork.
          </p>
          <svg className={styles.outlineBlob} viewBox="0 0 1000 420" aria-hidden focusable="false" data-reveal>
            <circle cx="500" cy="500" r="470" pathLength={1} />
            <rect x="560" y="200" width="46" height="120" rx="23" transform="rotate(-18 583 260)" pathLength={1} />
            <rect x="720" y="170" width="46" height="120" rx="23" transform="rotate(-18 743 230)" pathLength={1} />
          </svg>
        </section>
      </main>

      <Footer className={styles.footer} cooking />
      <Reveals />
    </div>
  );
}
