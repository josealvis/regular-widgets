/** @type {import('next').NextConfig} */
const nextConfig = {
    output:'export',
    assetPrefix: isProd ? './regular-widgets/' : undefined,
};

export default nextConfig;
