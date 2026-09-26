import type { NextConfig } from "next";

const pages = process.env.GITHUB_PAGES === "1";

// Served from the root of helix.5280webs.com (public/CNAME), so no base path.
const basePath = "";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  output: pages ? "export" : undefined,
  basePath,
  trailingSlash: pages,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
