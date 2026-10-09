import Link from "next/link";
import type { ReactNode } from "react";
import CopyRow from "../CopyRow";
import type { FootLink } from "./shared";

// One footer link as the right element: a page link, a link that opens a new tab, or a button that copies.
export default function Go({ link, className, current, children }: { link: FootLink; className: string; current?: boolean; children: ReactNode }) {
  if (link.copy) return <CopyRow className={className} text={link.copy} track={link.track}>{children}</CopyRow>;
  const props = { className, "aria-current": current ? ("page" as const) : undefined, "data-cmd": link.cmd, ...link.track };
  if (link.out)
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  if (link.href!.startsWith("/"))
    return (
      <Link href={link.href!} {...props}>
        {children}
      </Link>
    );
  return (
    <a href={link.href} {...props}>
      {children}
    </a>
  );
}
