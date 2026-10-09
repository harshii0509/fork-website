"use client";

import { useEffect, useState } from "react";
import { track } from "../track";
import styles from "./v2.module.css";

// Copies a command and says "Copied" for a moment. Used by the install row and the letter's P.S.
export default function CopyButton({ text, event, label, className = styles.copy }: { text: string; event: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      track(event);
    } catch {
      // No clipboard (an old browser or an iframe): the command is still there to select.
    }
  };

  return (
    <button className={className} onClick={copy} aria-live="polite" aria-label={copied ? "Copied" : label}>
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
