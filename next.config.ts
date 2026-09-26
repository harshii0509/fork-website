import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json in the home folder would otherwise be taken as the workspace root.
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
