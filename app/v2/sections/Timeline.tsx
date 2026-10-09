import { ENTRIES, RELEASES } from "../../whats-cooking/entries";
import { PROOF } from "../content";
import Figure from "../hairline/Figure";
import Dots, { type Release } from "./TimelineDots";

// Proof that Fork is alive: every release as a dot, oldest to newest, and for the one you point at, its headline
// change. Read from What's cooking's own entries, so it's never out of date. Only app changes count here.

const day = (at: string) => new Date(at).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });

export default function Timeline() {
  const releases: Release[] = [...RELEASES].reverse().map((r) => {
    const app = ENTRIES.filter((e) => e.version === r.version && e.where === "app");
    const lead = app.find((e) => e.kind === "new") ?? app[0];
    return { version: r.version, day: day(r.at), count: app.length, title: lead?.title ?? "Fixes and small things", what: lead?.what ?? "" };
  });
  const first = new Date(RELEASES[RELEASES.length - 1].at).getTime();
  const last = new Date(RELEASES[0].at).getTime();
  const days = Math.max(1, Math.ceil((last - first) / 86_400_000));
  const newest = RELEASES[0].version.split(".").slice(0, 2).join(".");

  return (
    <Dots
      releases={releases}
      lede={PROOF.lede(RELEASES.length, days)}
      more={PROOF.more}
      figure={<Figure name="numerals" digits={newest} label={`Fork ${newest}, in tall line-drawn numerals.`} />}
    />
  );
}
