import type { NextConfig } from "next";
import NextBundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfigOptions: NextConfig = {
  reactStrictMode: false,
  env: {
    apiURL: 'https://localhost:5000',
  },
  images: {
    domains: ['localhost'],
  }
};

const nextConfig: NextConfig = process.env.ANALYZE === 'true' ? withBundleAnalyzer(nextConfigOptions) : nextConfigOptions;
const withNextIntl = createNextIntlPlugin('./src/app/i18n/request.ts');

export default withNextIntl(nextConfig);
