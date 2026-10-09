import type { ReactNode } from "react";
import { ENTRIES, RELEASES } from "../../whats-cooking/entries";
import { DOWNLOAD, GITHUB, INSTALL_CMD } from "../content";

// What the three footers share: the facts about Fork they show, their icons and their links, so the footers
// never drift apart. Every link keeps the data-track the site has always counted.

export const X = "https://x.com/harshii04";
export const LINKEDIN = "https://www.linkedin.com/in/harshui/";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// "2026-10-09T14:27+05:30" → "9 Oct", read from the string so the server and the browser agree.
const day = (at: string) => `${+at.slice(8, 10)} ${MONTHS[+at.slice(5, 7) - 1]}`;

// Where Fork is at: the latest release, when it shipped, and how many app changes are still cooking.
export type Facts = { version: string; shipped: string; cooking: number };
export function facts(): Facts {
  return { version: RELEASES[0].version, shipped: day(RELEASES[0].at), cooking: ENTRIES.filter((e) => e.where === "app" && !e.version).length };
}

// The footers' icons: Phosphor (MIT, phosphoricons.com), regular weight, as Fork's Files tab falls back to.
const PH = {
  "folder-open": "M245,110.64A16,16,0,0,0,232,104H216V88a16,16,0,0,0-16-16H130.67L102.94,51.2a16.14,16.14,0,0,0-9.6-3.2H40A16,16,0,0,0,24,64V208h0a8,8,0,0,0,8,8H211.1a8,8,0,0,0,7.59-5.47l28.49-85.47A16.05,16.05,0,0,0,245,110.64ZM93.34,64,123.2,86.4A8,8,0,0,0,128,88h72v16H69.77a16,16,0,0,0-15.18,10.94L40,158.7V64Zm112,136H43.1l26.67-80H232Z",
  "file-arrow-down": "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-42.34-61.66a8,8,0,0,1,0,11.32l-24,24a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L120,164.69V120a8,8,0,0,1,16,0v44.69l10.34-10.35A8,8,0,0,1,157.66,154.34Z",
  "terminal-window": "M128,128a8,8,0,0,1-3,6.25l-40,32a8,8,0,1,1-10-12.5L107.19,128,75,102.25a8,8,0,1,1,10-12.5l40,32A8,8,0,0,1,128,128Zm48,24H136a8,8,0,0,0,0,16h40a8,8,0,0,0,0-16Zm56-96V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56ZM216,200V56H40V200H216Z",
  "cooking-pot": "M88,48V16a8,8,0,0,1,16,0V48a8,8,0,0,1-16,0Zm40,8a8,8,0,0,0,8-8V16a8,8,0,0,0-16,0V48A8,8,0,0,0,128,56Zm32,0a8,8,0,0,0,8-8V16a8,8,0,0,0-16,0V48A8,8,0,0,0,160,56Zm92.8,46.4L224,124v60a32,32,0,0,1-32,32H64a32,32,0,0,1-32-32V124L3.2,102.4a8,8,0,0,1,9.6-12.8L32,104V80a8,8,0,0,1,8-8H216a8,8,0,0,1,8,8v24l19.2-14.4a8,8,0,0,1,9.6,12.8ZM208,88H48v96a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16Z",
  "github-logo": "M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.83a8.09,8.09,0,0,0,1,7.65A41.72,41.72,0,0,1,200,104Z",
  "x-logo": "M214.75,211.71l-62.6-98.38,61.77-67.95a8,8,0,0,0-11.84-10.76L143.24,99.34,102.75,35.71A8,8,0,0,0,96,32H48a8,8,0,0,0-6.75,12.3l62.6,98.37-61.77,68a8,8,0,1,0,11.84,10.76l58.84-64.72,40.49,63.63A8,8,0,0,0,160,224h48a8,8,0,0,0,6.75-12.29ZM164.39,208,62.57,48h29L193.43,208Z",
  "linkedin-logo": "M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z",
} as const;

export type IconName = keyof typeof PH;
export const ico = (name: IconName): ReactNode => (
  <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden focusable="false">
    <path d={PH[name]} />
  </svg>
);

// The links, in the order every footer lists them. `copy` is copied rather than opened.
export type FootLink = { cmd: string; name: string; what: string; icon: IconName; href?: string; copy?: string; out?: boolean; track: Record<string, string> };
export const LINKS: FootLink[] = [
  { cmd: "download", name: "download", what: "get Fork for your Mac", icon: "file-arrow-down", href: DOWNLOAD, track: { "data-track": "download_clicked", "data-from": "footer" } },
  { cmd: "install", name: "install.sh", what: "copy the one-line install", icon: "terminal-window", copy: INSTALL_CMD, track: { "data-track": "install_copied", "data-from": "footer" } },
  { cmd: "cooking", name: "whats-cooking/", what: "what’s new, and what’s next", icon: "cooking-pot", href: "/whats-cooking", track: { "data-track": "cooking_clicked", "data-from": "footer" } },
  { cmd: "source", name: "source", what: "the code, on GitHub", icon: "github-logo", href: GITHUB, out: true, track: { "data-track": "github_clicked", "data-from": "footer" } },
  { cmd: "x", name: "x", what: "me, on X", icon: "x-logo", href: X, out: true, track: { "data-track": "social_clicked", "data-network": "x" } },
  { cmd: "linkedin", name: "linkedin", what: "me, on LinkedIn", icon: "linkedin-logo", href: LINKEDIN, out: true, track: { "data-track": "social_clicked", "data-network": "linkedin" } },
];
