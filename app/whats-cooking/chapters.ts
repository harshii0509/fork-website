import { ENTRIES, RELEASES, type Entry } from "./entries";

// The changelog as chapters, one per release, newest first. An app change goes in the release it shipped in;
// a change to the website or the kitchen goes in the release whose run-up it happened in (the first release
// served after it). Whatever came after the newest release, or hasn't shipped yet, is "On the stove".
export type Chapter = {
  key: string; // the release's version, or "stove"
  version: string | null;
  at: string | null; // when the release was served
  entries: Entry[];
};

const time = (iso: string) => new Date(iso).getTime();

export function chapters(): Chapter[] {
  const releases = [...RELEASES].sort((a, b) => time(b.at) - time(a.at));
  const stove: Chapter = { key: "stove", version: null, at: null, entries: [] };
  const byVersion = new Map<string, Chapter>(releases.map((r) => [r.version, { key: r.version, version: r.version, at: r.at, entries: [] }]));

  for (const e of ENTRIES) {
    let chapter: Chapter | undefined;
    if (e.version) chapter = byVersion.get(e.version);
    else if (e.where !== "app") {
      // The oldest release served at or after this change.
      const next = [...releases].reverse().find((r) => time(r.at) >= time(e.at));
      chapter = next && byVersion.get(next.version);
    }
    (chapter ?? stove).entries.push(e);
  }

  const all = [stove, ...byVersion.values()];
  for (const c of all) c.entries.sort((a, b) => time(b.at) - time(a.at));
  return all.filter((c) => c.entries.length);
}

// "Thu, 9 Oct", in India time like the rest of the changelog.
export const day = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Kolkata" });

export const clock = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" });

// A chapter's place on the page: #v1-1-0, or #stove.
export const anchor = (c: Chapter) => (c.version ? `v${c.version.replace(/\./g, "-")}` : "stove");
