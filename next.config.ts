import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  env: {
    apiURL: 'https://localhost:5000',
  },
};

export default nextConfig;
