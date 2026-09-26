import posthog from "posthog-js";

// Send an analytics event. Only the live site sends (see instrumentation-client.ts); anywhere else,
// including `npm run dev`, it just logs so you can see what would be tracked.
export function track(event: string, props?: Record<string, string | number>) {
  if (posthog.__loaded) posthog.capture(event, props);
  else console.info("[analytics]", event, props ?? {});
}
