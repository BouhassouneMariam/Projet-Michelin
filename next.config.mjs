/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "axwwgrkdco.cloudimg.io"
      },
      {
        protocol: "https",
        hostname: "d3h1lg3ksw6i6b.cloudfront.net"
      }
    ]
  }
};

export default nextConfig;
