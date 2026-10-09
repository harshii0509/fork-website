"use client";

import { useRef } from "react";
import { useSeen, useTyped } from "../hooks";
import s from "./mac.module.css";

// The glossy chat bubble beside each feature: it types itself the first time it comes on screen.
export default function Bubble({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const seen = useSeen(ref, "0px 0px -20% 0px");
  const typed = useTyped(text, seen, 45);
  return (
    <p ref={ref} className={s.bubble}>
      <span className={s.bubbleGhost} aria-hidden>
        {text}
      </span>
      <span className={s.bubbleText}>{typed}</span>
    </p>
  );
}
