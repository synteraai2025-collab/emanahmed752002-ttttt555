/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Important: Allow the dev server to be accessed from proxy
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
  // Ensure dev server binds to 0.0.0.0
  env: {
    HOST: '0.0.0.0',
  },
  images: {
    domains: [],
  },
};

module.exports = nextConfig;