import type { NextConfig } from "next";
import NextBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfigOptions: NextConfig = {
  reactStrictMode: false,
  env: {
    apiURL: 'https://localhost:5000',
  }
};

const nextConfig: NextConfig = process.env.ANALYZE === 'true' ? withBundleAnalyzer(nextConfigOptions) : nextConfigOptions;

export default nextConfig;
