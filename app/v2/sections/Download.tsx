"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { track } from "../../track";
import { DOWNLOAD, INSTALL_CMD } from "../content";
import styles from "../v2.module.css";

// Two ways in: the .dmg, or the one-line install (curl skips the "Open Anyway" step).
export default function Download() {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
      setCopied(true);
      track("install_copied");
    } catch {
      // No clipboard (an old browser or an iframe): the command is still there to select.
    }
  };

  return (
    <div className={styles.dlRows}>
      <a className={`${styles.dlRow} ${styles.dlMain}`} href={DOWNLOAD} data-track="download_clicked" data-from="download">
        <Image src="/art/apple.svg" width={20} height={20} alt="" aria-hidden className={styles.dlApple} />
        <span className={styles.dlText}>
          <b>Download for Mac</b>
          <small>Fork.dmg · Apple Silicon</small>
        </span>
        <span className={styles.dlArrow} aria-hidden>
          ↓
        </span>
      </a>
      <div className={styles.dlRow}>
        <span className={styles.dlTerm} aria-hidden>
          ❯_
        </span>
        <span className={styles.dlText}>
          <b>Or install from the terminal</b>
          <code>{INSTALL_CMD}</code>
        </span>
        <button className={styles.copy} onClick={copy} aria-live="polite">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
