/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The screenshot harness builds into its own dist dir so a concurrently
  // running `next dev` (which rewrites .next) can't invalidate its server.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        child_process: false,
      };
    }
    config.externals = config.externals || [];
    if (Array.isArray(config.externals)) {
      config.externals.push({ undici: 'undici' });
    }
    return config;
  },
}

module.exports = nextConfig
