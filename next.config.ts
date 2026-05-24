import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve background/sprite art exactly as authored. The Image Optimizer caches
  // optimized output keyed on the source URL, which served stale art whenever an
  // asset was overwritten (e.g. a placeholder swapped for the real baby image).
  // Disabling optimization guarantees the current file always renders.
  images: { unoptimized: true },
};

export default nextConfig;
