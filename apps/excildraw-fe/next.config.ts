/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // This allows Next.js to build even with TS/ESLint errors
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
