import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Tells webpack (next build) to transpile @faithcare/ui
  transpilePackages: ["@faithcare/ui"],

  // Turbopack config (next dev) — top-level in Next.js 16, not under "experimental"
  turbopack: {
    // Expand Turbopack's file-system root to the monorepo root so it can
    // reach the shared/ directory (which is outside apps/landing-page/).
    // Required per the Next.js 16 docs for any file:// or symlinked local packages.
    root: path.resolve(__dirname, "../.."),
  },
};

export default nextConfig;
