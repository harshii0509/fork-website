"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "./hooks";
import forkStyles from "./fork/fork.module.css";
import Square from "./fork/Square";
import styles from "./v2.module.css";

// The headline's mark: a workspace's status square, drawn large. It ripples for three waves as the page
// arrives (working), then settles (ready). With reduced motion it is simply still.
export default function HeroSquare() {
  const still = useReducedMotion();
  const [working, setWorking] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setWorking(false), 3 * 2100 + 400);
    return () => clearTimeout(t);
  }, []);
  return (
    <span className={`${forkStyles.fork} ${styles.heroSquare}`} aria-hidden>
      <Square s={working && !still ? "working" : "idle"} color="var(--ink)" />
    </span>
  );
}
