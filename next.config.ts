import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  trailingSlash: false,
  async redirects() {
    return [];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOWALL",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors * http: https:; default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;",
          },
        ],
      },
    ];
  },
  allowedDevOrigins: [
    "preview-chat-3d6a2bc6-029a-4362-bdea-f2c5cd7bf5c3.space-z.ai",
    ".space-z.ai",
    ".space.chatglm.site",
    ".chatglm.site",
  ],
};

export default nextConfig;
