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
  turbopack: {
    root: './', // __dirname অনেক সময় টাইপ এরর দিতে পারে, তাই './' ব্যবহার করা নিরাপদ
  },
  // ✅ ১ নম্বর লজিক: সরাসরি রিডাইরেক্ট
  async redirects() {
    return [
      {
        source: '/',           // যখন ইউজার মেইন ইউআরএলে আসবে
        destination: '/login', // তাকে সরাসরি লগইন পেজে পাঠিয়ে দাও
        permanent: false,      // এটি টেম্পোরারি (ব্রাউজার ক্যাশ করবে না)
      },
    ];
  },
};

export default nextConfig;