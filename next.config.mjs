/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep local previews intact while a production build runs.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  // Production builds share a small host with other services.
  ...(process.env.PIXELCARD_LIMITED_BUILD === "1"
    ? { experimental: { cpus: 1 } }
    : {}),
  async rewrites() {
    const target = (
      process.env.ENGAGEMENT_URL || "http://127.0.0.1:4000"
    ).replace(/\/$/, "");
    return [
      {
        source: "/api/e/:path*",
        destination: `${target}/:path*`,
      },
    ];
  },
};

export default nextConfig;
