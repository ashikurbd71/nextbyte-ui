/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/api/cdn/files/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/**', // Allow all paths from your API server
            },
            {
                protocol: 'https',
                hostname: 'cdn.nextbyteitinstitute.com',
                pathname: '/api/cdn/files/**',
            },
        ],
    },
};

export default nextConfig;
