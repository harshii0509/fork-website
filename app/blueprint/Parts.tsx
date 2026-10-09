import { IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import Link from "next/link";
import { DOWNLOAD, GITHUB, type Section } from "../v2/content";
import { X } from "../Footer";
import { chapters } from "../whats-cooking/chapters";
import styles from "./blueprint.module.css";

// The Blueprint direction's shared parts: its fonts, a section's title and number, the nav, and the drawing's
// title block that closes every sheet.

export const serif = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], variable: "--font-serif" });
export const mono = IBM_Plex_Mono({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--font-plex" });

export function Title({ s, as: H = "h2" }: { s: Section; as?: "h1" | "h2" }) {
  const [a, em, b] = s.title;
  return (
    <H id={`${s.id}-h`} className={H === "h1" ? styles.h1 : styles.h2}>
      {a}
      <em>{em}</em>
      {b}
    </H>
  );
}

// The left column of a cell: its number and what it is.
export function Label({ n, s }: { n: number; s: Section }) {
  return (
    <div className={styles.label} data-reveal>
      <span>{String(n).padStart(2, "0")}</span>
      {s.eyebrow}
    </div>
  );
}

export function Nav({ away = false }: { away?: boolean }) {
  const home = away ? "/blueprint" : "";
  return (
    <nav className={styles.nav} aria-label="Fork">
      <a href={away ? "/blueprint" : "#top"} className={styles.brand}>
        <span className={styles.mark} aria-hidden />
        Fork
      </a>
      <div className={styles.links}>
        <a href={`${home}#workspaces`}>Workspaces</a>
        <a href={`${home}#design`}>Design</a>
        <Link href="/blueprint/cooking" data-track="cooking_clicked" data-from="nav">
          Changelog
        </Link>
        <a href={GITHUB} target="_blank" rel="noopener noreferrer" data-track="github_clicked" data-from="nav">
          GitHub
        </a>
      </div>
      <a className={styles.navCta} href={DOWNLOAD} data-track="download_clicked" data-from="nav">
        Download ↓
      </a>
    </nav>
  );
}

// The drawing's title block, which closes every sheet.
export function TitleBlock() {
  const rev = chapters().find((c) => c.version)?.version ?? "";
  return (
    <footer className={styles.titleBlock}>
      <div>
        <small>Project</small>Fork, a terminal for Mac
      </div>
      <div>
        <small>Drawn by</small>
        <a href={X} target="_blank" rel="noopener noreferrer" data-track="social_clicked" data-network="x">
          Harshvardhan
        </a>
      </div>
      <div>
        <small>Revision</small>
        {rev}
      </div>
      <div>
        <small>Sheets</small>
        <span>
          <Link href="/blueprint">Home</Link> · <Link href="/blueprint/cooking">Changelog</Link>
        </span>
      </div>
      <div>
        <small>Source</small>
        <a href={GITHUB} target="_blank" rel="noopener noreferrer" data-track="github_clicked" data-from="footer">
          harshii0509/Fork
        </a>
      </div>
    </footer>
  );
}

