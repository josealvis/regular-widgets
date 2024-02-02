/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
    output:'export',
    assetPrefix: isProd ? './regular-widgets/' : undefined,
};

export default nextConfig;
