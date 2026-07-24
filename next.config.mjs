/** @type {import('next').NextConfig} */
const nextConfig = {
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
