/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      // NextJS <Image> component needs to whitelist domains for src={}
      "lh3.googleusercontent.com",
      "pbs.twimg.com",
      "images.unsplash.com",
      "logos-world.net",
      "dl.airtable.com",
      "v5.airtableusercontent.com",
    ],
  },
  webpack: (config) => {
    config.infrastructureLogging = {
      level: 'error'
    }
    return config
  },
};

module.exports = nextConfig;
