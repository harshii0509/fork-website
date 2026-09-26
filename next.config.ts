import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json in the home folder would otherwise be taken as the workspace root.
  turbopack: { root: import.meta.dirname },
  // Analytics goes through this site's own address (/ingest), so ad blockers don't drop it.
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: "https://us-assets.i.posthog.com/static/:path*" },
      { source: "/ingest/:path*", destination: "https://us.i.posthog.com/:path*" },
    ];
  },
  skipTrailingSlashRedirect: true, // PostHog's API paths end in "/"
};

export default nextConfig;
