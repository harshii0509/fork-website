"use client";

import Link from "next/link";
import { HOME } from "../v2/content";
import v2 from "../v2/v2.module.css";
import styles from "./cooking.module.css";

// Back to the home page. Came from there? Step back instead, so you land where you left off.
export default function BackButton() {
  function back(e: React.MouseEvent) {
    // From the site: either this page was loaded from one of ours (referrer), or the site was loaded on
    // another page and got here by clicking (the loaded page's address isn't this one).
    let fromHere = false;
    try {
      const loaded = (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined)?.name;
      fromHere =
        (!!document.referrer && new URL(document.referrer).origin === location.origin) ||
        (!!loaded && new URL(loaded).pathname !== location.pathname);
    } catch {}
    if (!fromHere || history.length < 2 || e.metaKey || e.ctrlKey || e.shiftKey) return; // a plain link does the rest
    e.preventDefault();
    history.back();
  }

  return (
    <Link href={HOME} className={`${v2.btnSoft} ${styles.back}`} onClick={back}>
      <span className={styles.backArrow} aria-hidden>
        ←
      </span>
      Back to Fork
    </Link>
  );
}
