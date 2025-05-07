import type { NextConfig } from "next";
import NextBundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';

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
    return [
      {
        source: '/pt-PT/paginas/admin/painel',
        destination: '/pt-PT/pages/admin/dashboard'
      },
      {
        source: '/pt-PT/paginas/noticias',
        destination: '/pt-PT/pages/news'
      },
      {
        source: '/pt-PT/paginas/noticias/:cid',
        destination: '/pt-PT/pages/news/:cid'
      },
      {
        source: '/pt-PT/paginas/noticias/:cid/:id',
        destination: '/pt-PT/pages/news/:cid/:id'
      },
      {
        source: '/pt-PT/paginas/arquivo',
        destination: '/pt-PT/pages/archive'
      },
      {
        source: '/pt-PT/paginas/utilizadores',
        destination: '/pt-PT/pages/users'
      }
    ]
  }
};

const nextConfig: NextConfig = process.env.ANALYZE === 'true' ? withBundleAnalyzer(nextConfigOptions) : nextConfigOptions;
const withNextIntl = createNextIntlPlugin('./src/app/i18n/request.ts');

export default withNextIntl(nextConfig);
