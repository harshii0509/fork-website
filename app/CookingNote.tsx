import Link from "next/link";
import { ENTRIES, STICKER } from "./whats-cooking/entries";
import styles from "./page.module.css";

// A sticky note taped to the Fork window: the newest change to the app, and the way into What's
// cooking. It reads the changelog, so it's always the latest without touching this file.
export default function CookingNote({ className = "" }: { className?: string }) {
  const latest = ENTRIES.find((e) => e.where === "app");
  if (!latest) return null;
  return (
    <Link
      href="/whats-cooking"
      className={`${styles.cookNote} ${className}`}
      data-track="cooking_clicked"
      data-from="note"
      aria-label={`Just cooked: ${latest.title}. See what’s cooking in Fork.`}
    >
      <span className={styles.cookJust}>just cooked!</span>
      <span className={styles.cookSticker} data-kind={latest.kind}>
        {STICKER[latest.kind]}
      </span>
      <span className={styles.cookTitle}>{latest.title}</span>
      <span className={styles.cookMore}>see what’s cooking →</span>
    </Link>
  );
}
