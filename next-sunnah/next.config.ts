import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    // The API key should be set in .env.local file or in deployment environment
    SUNNAH_API_KEY: process.env.SUNNAH_API_KEY || "",
  },
};

export default nextConfig;
