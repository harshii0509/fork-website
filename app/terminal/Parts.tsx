import { IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { DOWNLOAD, GITHUB, type Section } from "../v2/content";
import styles from "./terminal.module.css";

// The Terminal direction's shared parts: its one font, the window bar, a section opened as a command, a title,
// and the giant wordmark that ends every page.

export const mono = IBM_Plex_Mono({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-plex" });

export function Bar({ title, away = false }: { title: string; away?: boolean }) {
  const home = away ? "/terminal" : "";
  return (
    <nav className={styles.bar} aria-label="Fork">
      <span className={styles.lights} aria-hidden>
        <i />
        <i />
        <i />
      </span>
      <a href={away ? "/terminal" : "#top"} className={styles.barTitle}>
        {title}
      </a>
      <div className={styles.barLinks}>
        <a href={`${home}#workspaces`}>workspaces</a>
        <a href={`${home}#design`}>design</a>
        <Link href="/terminal/cooking" data-track="cooking_clicked" data-from="nav">
          changelog
        </Link>
        <a href={GITHUB} target="_blank" rel="noopener noreferrer" data-track="github_clicked" data-from="nav">
          github
        </a>
        <a className={styles.barCta} href={DOWNLOAD} data-track="download_clicked" data-from="nav">
          download
        </a>
      </div>
    </nav>
  );
}

// A section opens as a command that types itself when it scrolls into view; its output prints underneath once
// the command has run. All in CSS (see .cmd in terminal.module.css), so without JS everything is just there.
export function Cmd({ cmd, id, children, className = "" }: { cmd: string; id: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`${styles.sec} ${className}`} aria-labelledby={`${id}-h`} style={{ "--n": cmd.length } as CSSProperties}>
      <div className={styles.cmd} data-reveal aria-hidden>
        <span className={styles.ps}>~/fork $ </span>
        <span className={styles.typed}>{cmd}</span>
      </div>
      <div className={styles.out}>{children}</div>
    </section>
  );
}

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

export function Wordmark() {
  return (
    <div className={styles.end}>
      <p className={styles.wordmark} aria-hidden>
        FORK
      </p>
      <div className={styles.endLine}>
        <span>[process completed]</span>
        <span>
          <Link href="/terminal">home</Link> · <Link href="/terminal/cooking">changelog</Link> ·{" "}
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" data-track="github_clicked" data-from="footer">
            github
          </a>{" "}
          · line drawings by{" "}
          <a href="https://hairline.lucasmarkes.com" target="_blank" rel="noopener noreferrer">
            hairline
          </a>
        </span>
      </div>
    </div>
  );
}
