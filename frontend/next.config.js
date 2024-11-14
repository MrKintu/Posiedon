const path = require('path');
const withBuilderDevTools = require('@builder.io/dev-tools/next')();

/** @type {import('next').NextConfig} */
const nextConfig = withBuilderDevTools({
    images: {
        domains: ['localhost'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.sanity.io',
                port: '',
            },
        ],
    },
    webpack: (config, { isServer }) => {
        config.resolve.alias['@logger'] = path.join(__dirname, 'logger');
        config.resolve.alias['@api_client'] = path.join(__dirname, 'api_client');

        return config;
    },
});

module.exports = nextConfig;
