import type { NextConfig } from "next";

const pages = process.env.GITHUB_PAGES === "1";

const nextConfig: NextConfig = {
  output: pages ? "export" : undefined,
  basePath: pages ? "/helix-frame-siding" : "",
  assetPrefix: pages ? "/helix-frame-siding/" : undefined,
  trailingSlash: pages,
  images: { unoptimized: true },
};

export default nextConfig;
