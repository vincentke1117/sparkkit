const normalizedBasePath = process.env.NEXT_PUBLIC_BASE_PATH
  ? `/${process.env.NEXT_PUBLIC_BASE_PATH.replace(/^\/+/, '').replace(/\/+$/, '')}`
  : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  assetPrefix: normalizedBasePath || undefined,
  basePath: normalizedBasePath || undefined,
};

export default nextConfig;
