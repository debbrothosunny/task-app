import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
    ],
  },
  // ✅ টাইপস্ক্রিপ্ট এবং এসিলিন্ট এরর ইগনোর করার লজিক
  typescript: {
    ignoreBuildErrors: true, // এটি টাইপ এরর থাকলেও বিল্ড হতে সাহায্য করবে
  },
  eslint: {
    ignoreDuringBuilds: true, // এটি লিন্টিং এরর ইগনোর করবে
  },
  turbopack: {
    root: './',
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;