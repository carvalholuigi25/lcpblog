import type { NextConfig } from "next";
import NextBundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';
import fs from 'fs';
import path from 'path';

const rewrites = JSON.parse(fs.readFileSync(path.join(__dirname, 'rewrites.json'), 'utf-8')).rewrites;

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfigOptions: NextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  env: {
    apiURL: 'https://localhost:5000',
    ghToken: process.env.ghToken,
    NEXT_IMAGE_ALLOWED_DOMAINS: 'localhost'
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
        search: '',
      },
    ],
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
    resolveAlias: {
      underscore: 'lodash',
    },
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json']
  },
  experimental: {
    turbopackMinify: true
  },
  async rewrites() {
    return rewrites;
  }
};

const nextConfig: NextConfig = process.env.ANALYZE === 'true' ? withBundleAnalyzer(nextConfigOptions) : nextConfigOptions;
const withNextIntl = createNextIntlPlugin('./src/app/i18n/request.ts');

export default withNextIntl(nextConfig);
