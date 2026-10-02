"use client";

import { useEffect, useRef } from "react";
import { track } from "../../track";
import { PAPER, PAPER_CMD } from "../content";
import CopyButton from "../CopyButton";
import styles from "../v2.module.css";

// The thank-you note, a white sheet folded in three. The first time it scrolls well into view the
// top third swings open, then the bottom. The page renders it flat, so with no JS or with reduced
// motion it's simply there.
//
// How it folds: the real sheet sits in the page (it sets the height and holds the working link and
// copy button). Two copies lie exactly on top of it, each clipped to a third and hinged on a fold
// line, with a blank back. While folded or opening, the real sheet shows only its middle third. Once
// open ("flat") the copies go, so only the real sheet is ever clicked. Only transforms move, and the
// box is the open letter's height from the start, so nothing below it jumps.
export default function Letter() {
  const box = useRef<HTMLDivElement>(null);
  const last = useRef<HTMLDivElement>(null); // the bottom flap, which opens last

  useEffect(() => {
    const el = box.current;
    const lastFlap = last.current;
    if (!el || !lastFlap || !("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.state = "folded";
    let timer = 0;
    const flat = () => {
      clearTimeout(timer);
      el.dataset.state = "flat";
    };
    const io = new IntersectionObserver(
      ([hit]) => {
        if (!hit?.isIntersecting) return;
        el.dataset.state = "opening";
        track("letter_opened");
        io.disconnect();
        lastFlap.addEventListener("transitionend", flat, { once: true });
        timer = window.setTimeout(flat, 1600); // in case transitionend never comes
      },
      { rootMargin: "0px 0px -18% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      lastFlap.removeEventListener("transitionend", flat);
    };
  }, []);

  return (
    <div ref={box} className={styles.letter} data-state="flat">
      <div className={styles.letterPaper}>
        <Sheet real />
      </div>
      <Flap className={styles.foldTop} />
      <Flap className={styles.foldBottom} flapRef={last} />
    </div>
  );
}

// A third of the sheet that folds: the letter's face, and a blank back. Never clicked or read out.
function Flap({ className, flapRef }: { className: string; flapRef?: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={flapRef} className={`${styles.fold} ${className}`} aria-hidden inert>
      <div className={`${styles.letterPaper} ${styles.foldFront}`}>
        <Sheet />
      </div>
      <div className={styles.foldBack} />
    </div>
  );
}

// What the letter says. Only the real one carries the heading's id and gets clicked.
function Sheet({ real = false }: { real?: boolean }) {
  return (
    <>
      <h2 id={real ? "thanks-h" : undefined} className={styles.note}>
        Thanks a ton!
      </h2>
      <p className={styles.bio}>
        I’m Harshvardhan. I spend my days in terminals, and I wanted one that felt faster when I need it, calmer when
        I’m juggling a dozen things, and a little more human when I’m figuring things out. So I made Fork.
      </p>
      <p className={styles.ps}>
        <span className={styles.psMark}>P.S.</span> The soft colours moving around this page are Paper Shaders, made by
        the people at{" "}
        <a href={PAPER} target="_blank" rel="noopener noreferrer" data-track="paper_clicked" data-from="thanks">
          Paper
        </a>
        . They’re free and open source. If you’d like some on your own site:
      </p>
      <div className={styles.psCmd}>
        <code>{PAPER_CMD}</code>
        <CopyButton text={PAPER_CMD} event="shaders_copied" label="Copy the Paper Shaders install command" />
      </div>
    </>
  );
}
