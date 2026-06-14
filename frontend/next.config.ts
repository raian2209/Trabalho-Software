import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gera um servidor auto-contido (.next/standalone) para imagem Docker enxuta.
  output: "standalone",
  images: {
    // placehold.co (e eventuais imagens de usuário) podem ser SVG. Permitimos SVG
    // no otimizador, mas com proteções: a resposta é servida como anexo e com CSP
    // que bloqueia scripts, evitando XSS via SVG malicioso.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
