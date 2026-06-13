import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gera um servidor auto-contido (.next/standalone) para imagem Docker enxuta.
  output: "standalone",
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
