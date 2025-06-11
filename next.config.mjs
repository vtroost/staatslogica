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
  // output: 'export', // Commented out to enable server-side functionality for sitemap
  reactStrictMode: true, // Re-enable Strict Mode for better performance and error catching
  images: {
    // Re-enable image optimization for better performance
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Explicitly tell Next.js to transpile these packages
  transpilePackages: [
    'decap-cms-lib-util',
    'decap-cms-core'
    // Add other decap-cms packages here if similar errors occur
  ],
  // Remove any API routes or dynamic features
  experimental: {
    scrollRestoration: true,
  },
  async redirects() {
    return [
      {
        source: '/nieuws',
        destination: '/categorieen',
        permanent: true,
      },
    ]
  },
};

// Combine the MDX config with your existing Next.js config
// Temporarily export the config directly without withMDX
// export default withMDX(nextConfig);
// Re-enable withMDX
export default withMDX(nextConfig);
