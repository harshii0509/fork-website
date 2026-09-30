"use client";

import { useEffect, useRef } from "react";
import { track } from "../../track";
import { PAPER, PAPER_CMD } from "../content";
import CopyButton from "../CopyButton";
import ShaderPanel from "../ShaderPanel";
import styles from "../v2.module.css";

// The thank-you note, sent as a letter. The first time the envelope scrolls well into view the seal
// pops, the flap swings open and the letter slides up out of it; then it stays open. The page
// renders it open, so with no JS or with reduced motion it's simply there. Only transforms move, and
// the box keeps the open letter's height from the start, so nothing below it jumps.
export default function Letter() {
  const box = useRef<HTMLDivElement>(null);
  const envelope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    const env = envelope.current;
    if (!el || !env || !("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.state = "closed";
    const io = new IntersectionObserver(
      ([hit]) => {
        if (!hit?.isIntersecting) return;
        el.dataset.state = "open";
        track("letter_opened");
        io.disconnect();
      },
      { rootMargin: "0px 0px -18% 0px" },
    );
    io.observe(env);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} className={styles.letter} data-state="open">
      <div className={styles.envBack} aria-hidden />
      <svg className={styles.flap} viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden focusable="false">
        <path d="M1 1 L50 58 L99 1 Z" vectorEffect="non-scaling-stroke" />
      </svg>

      <div className={styles.letterSlot}>
        <ShaderPanel
          shader="PaperTexture"
          base="#FAF8F3"
          className={styles.letterPaper}
          steer={0}
          params={{
            colorBack: "#FAF8F3",
            colorPaper: "#FCFAF6",
            colorShadow: "#DCD2BE",
            fit: "cover",
            scale: 1,
            roughness: 0.35,
            fiber: 0.25,
            folds: 0.45,
            foldSizeY: 0.5,
            crumples: 0.15,
            drops: 0.05,
            seed: 2.4,
          }}
        >
          <h2 id="thanks-h" className={styles.note}>
            Thanks a ton!
          </h2>
          <p className={styles.bio}>
            I’m Harshvardhan. I spend my days in terminals, and I wanted one that felt faster when I need it, calmer when
            I’m juggling a dozen things, and a little more human when I’m figuring things out. So I made Fork.
          </p>
          <p className={styles.ps}>
            <span className={styles.psMark}>P.S.</span> The soft colours moving around this page are Paper Shaders,
            made by the people at{" "}
            <a href={PAPER} target="_blank" rel="noopener noreferrer" data-track="paper_clicked" data-from="thanks">
              Paper
            </a>
            . They’re free and open source. If you’d like some on your own site:
          </p>
          <div className={styles.psCmd}>
            <code>{PAPER_CMD}</code>
            <CopyButton text={PAPER_CMD} event="shaders_copied" label="Copy the Paper Shaders install command" />
          </div>
        </ShaderPanel>
      </div>

      <div ref={envelope} className={styles.envFront} aria-hidden>
        <svg viewBox="0 0 100 60" preserveAspectRatio="none" focusable="false">
          <path className={styles.envFill} d="M0 0 L50 34 L100 0 L100 60 L0 60 Z" />
          <path d="M0 0 L50 34 L100 0 M0 60 L38 26 M100 60 L62 26" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <span className={styles.seal} aria-hidden>
        <i />
        <i />
      </span>
    </div>
  );
}
