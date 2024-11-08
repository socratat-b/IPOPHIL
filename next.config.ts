import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      /**
       * mar-note: add the domain links here for your images if any
       */
      "images.unsplash.com",
    ],
  },
};

export default nextConfig;
