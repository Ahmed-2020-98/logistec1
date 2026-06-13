import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // This project carries its own lockfile; pin the tracing root to silence
  // Next's multi-lockfile workspace-root inference warning.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
