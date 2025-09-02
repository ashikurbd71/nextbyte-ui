/** @type {import('next').NextConfig} */
const nextConfig = {
    // Ensure proper output for Next.js 15
    output: 'standalone',

    // Enable experimental features that are stable in Next.js 15
    experimental: {
        // Enable modern React features (requires babel-plugin-react-compiler)
        // reactCompiler: true,
    },

    // Image configuration
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

    // Ensure proper webpack configuration
    webpack: (config, { isServer }) => {
        // Ensure middleware manifest is generated
        if (isServer) {
            config.externals = config.externals || [];
        }
        return config;
    },
};

export default nextConfig;
