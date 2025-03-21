const nextConfig = {
  pageExtensions: ["ts", "tsx"],
  images: {
    domains: ['ui-avatars.com'], // 添加 ui-avatars.com 到允许的域名列表
    dangerouslyAllowSVG: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.optimization.minimize = false; // 禁用压缩
    return config;
  },
  typescript: {
    // ignoreBuildErrors: true, // 添加忽略构建错误的配置
  },
};

export default nextConfig;