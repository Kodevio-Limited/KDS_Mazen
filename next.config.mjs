/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Docker standalone build (runner stage copies .next/standalone)
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
