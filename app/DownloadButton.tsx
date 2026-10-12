"use client";

import { IconApple } from "@central-icons-react/round-outlined-radius-2-stroke-1.5/IconApple";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

// The download happens in the browser's own UI (a toolbar corner), so the button says it started.
// Both labels share one grid cell, so the button keeps its width while they swap.
export default function DownloadButton({ href, className = styles.download, from }: { href: string; className?: string; from?: string }) {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => setStarted(false), 4000);
    return () => clearTimeout(t);
  }, [started]);

  return (
    <a className={className} href={href} onClick={() => setStarted(true)} data-track="download_clicked" data-from={from} data-started={started || undefined}>
      <IconApple size={20} mode="raw" />
      <span className={styles.labels}>
        <span className={styles.label} aria-hidden={started}>
          Download for Mac
        </span>
        <span className={styles.label} aria-hidden={!started}>
          Downloading…
        </span>
      </span>
    </a>
  );
}
