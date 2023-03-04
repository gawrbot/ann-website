/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SPACE_ID: process.env.SPACE_ID,
    ACCESS_TOKEN: process.env.ACCESS_TOKEN,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        port: '',
        pathname: '/**/**',
      },
    ],
  },
};

module.exports = nextConfig;
