const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/lander/:path*',
        destination: 'https://candurmaz.art/',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'candurmaz-portfolio.vercel.app' }],
        destination: 'https://candurmaz.art/:path*',
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
