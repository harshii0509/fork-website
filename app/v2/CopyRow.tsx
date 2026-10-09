"use client";

import { type ReactNode, useEffect, useState } from "react";

// A footer button that copies a line (the install command), and says "copied" for a moment.
export default function CopyRow({ className, text, track, children }: { className: string; text: string; track: Record<string, string>; children: ReactNode }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(t);
  }, [copied]);
  return (
    <button
      type="button"
      className={className}
      title={text}
      data-cmd="install"
      {...track}
      onClick={() => navigator.clipboard?.writeText(text).then(() => setCopied(true), () => {})}
    >
      {children}
      <span aria-live="polite" data-note>
        {copied ? "copied" : ""}
      </span>
    </button>
  );
}
