import posthog from "posthog-js";
import { track } from "./app/track";

// Analytics: PostHog, the same project as the Fork app (designer-terminal/analytics.mjs), so a
// visit → download → app opened funnel lives in one place. Every event carries site: fork-website.
// The key is PostHog's public project key; it's meant to ship in the page.
const KEY = "phc_Azjw5QQ5bbxXz9gREpHK6SKbntQ4KC5ECWAu6z6hjAZp";
const local = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);

if (process.env.NODE_ENV === "production" && !local) {
  try {
    posthog.init(KEY, {
      api_host: "/ingest", // proxied by next.config.ts, so ad blockers don't hide visits
      ui_host: "https://us.posthog.com",
      defaults: "2026-08-30",
      persistence: "memory", // no cookies or local storage: no consent banner needed
      person_profiles: "identified_only",
      autocapture: false, // only the events below
      capture_pageview: "history_change", // also counts moving between pages without a reload
      capture_pageleave: true,
      disable_session_recording: true,
    });
    posthog.register({ site: "fork-website" });
  } catch {
    // Analytics must never break the page.
  }
}

// Links marked data-track="event" (and optional data-network, data-from) report their click.
document.addEventListener(
  "click",
  (e) => {
    const link = (e.target as Element | null)?.closest<HTMLElement>("[data-track]");
    if (!link) return;
    const { track: event, network, from } = link.dataset;
    if (event) track(event, { ...(network && { network }), ...(from && { from }) });
  },
  true,
);
