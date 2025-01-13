/** @type {import('next').NextConfig} */
const nextConfig = {
	i18n: {
    locales: ['en', 'tj'], // List of supported locales
    defaultLocale: 'en',    // Default locale
    localeDetection: true,  // Automatically detect user language
  },
  images: {
    domains: ['instagram-api.softclub.tj', 'logos-world.net', 'static.cdninstagram.com'],
  },
};

export default nextConfig;
