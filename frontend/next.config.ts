import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https:///**"),
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
      },
    ],
  },
};

export default nextConfig;
