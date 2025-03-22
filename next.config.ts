import type { NextConfig } from "next";

const nextConfig = {
  env: {
    MONGO_URL: process.env.MONGO_URL,
  },
};

export default nextConfig;
