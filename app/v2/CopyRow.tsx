"use client";

import { type ReactNode, useEffect, useState } from "react";

// The footer's install.sh row: a click copies the install command, and the row says so for a moment.
export default function CopyRow({ className, text, icon, name }: { className: string; text: string; icon: ReactNode; name: string }) {
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
      data-track="install_copied"
      data-from="footer"
      onClick={() => navigator.clipboard?.writeText(text).then(() => setCopied(true), () => {})}
    >
      {icon}
      <span>{name}</span>
      <span aria-live="polite" data-note>
        {copied ? "copied" : ""}
      </span>
    </button>
  );
}
