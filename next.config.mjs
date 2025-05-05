// Remove type import - not needed in .mjs
// import type { NextConfig } from "next";

import nextMDX from '@next/mdx';

// Configure MDX support
const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    // Optionally add remark/rehype plugins here if needed later
    // remarkPlugins: [],
    // rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Remove any API routes or dynamic features
  experimental: {
    // Disable any experimental features
  }
};

// Combine the MDX config with your existing Next.js config
// Temporarily export the config directly without withMDX
// export default withMDX(nextConfig);
// Re-enable withMDX
export default withMDX(nextConfig);
