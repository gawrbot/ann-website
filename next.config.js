/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BLOG_URL: process.env.BLOG_URL,
    CONTENT_API_KEY: process.env.CONTENT_API_KEY,
  },
};

module.exports = nextConfig;
