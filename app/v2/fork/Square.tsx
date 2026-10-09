import type { CSSProperties } from "react";
import styles from "./fork.module.css";

// A workspace's status square, as the app draws it (designer-terminal renderer.js renderTabs): nine tiles in
// the workspace's colour. Working, they part into a lattice that ripples; needs you, yellow; failed, red.
export type SqState = "idle" | "working" | "needs" | "failed";

const TILES = Array.from({ length: 9 }, (_, i) => ({ "--c": i % 3, "--r": Math.floor(i / 3) }) as CSSProperties);

export default function Square({ s = "idle", color, className = "" }: { s?: SqState; color?: string; className?: string }) {
  return (
    <span
      className={`${styles.sq} ${className}`}
      data-s={s === "idle" ? undefined : s}
      style={color ? ({ "--tab-c": color } as CSSProperties) : undefined}
      aria-hidden
    >
      <span className={styles.cubes}>
        {TILES.map((t, i) => (
          <i key={i} style={t} />
        ))}
      </span>
    </span>
  );
}
