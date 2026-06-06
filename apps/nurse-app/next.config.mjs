/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true
  },
  transpilePackages: ["@eiranova/ui", "@eiranova/mock-data"]
};

export default nextConfig;
