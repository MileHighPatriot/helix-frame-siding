import type { NextConfig } from "next";

const pages = process.env.GITHUB_PAGES === "1";

const basePath = pages ? "/helix-frame-siding" : "";

const nextConfig: NextConfig = {
  output: pages ? "export" : undefined,
  basePath,
  assetPrefix: pages ? "/helix-frame-siding/" : undefined,
  trailingSlash: pages,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
