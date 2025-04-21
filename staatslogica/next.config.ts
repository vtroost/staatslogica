import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure static export for Netlify compatibility
  output: 'export',
  // Optional: Ensure trailing slashes for static paths (often helpful)
  trailingSlash: true,

  // Ensure images configured for static export if using next/image
  // If your images are in /public, this might not be strictly needed
  // but good to be aware of. If using external domains, configure them here.
  images: {
    unoptimized: true, // Required for static export with next/image
  }

  /* other config options can go here */
};

export default nextConfig;
