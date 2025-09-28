const normalizedBasePath = process.env.NEXT_PUBLIC_BASE_PATH
  ? `/${process.env.NEXT_PUBLIC_BASE_PATH.replace(/^\/+/, '').replace(/\/+$/, '')}`
  : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

if (normalizedBasePath) {
  nextConfig.basePath = normalizedBasePath;
}

export default nextConfig;
