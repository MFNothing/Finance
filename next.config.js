/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用独立输出，用于 Docker 部署
  output: 'standalone',
  
  // 实验性功能
  experimental: {
    // 输出文件追踪根目录
    outputFileTracingRoot: undefined,
  },
  
  // 图片优化配置
  images: {
    // 允许的图片域名
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // 环境变量配置
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // 禁用 Next.js 遥测
  telemetry: false,
  
  // 压缩配置
  compress: true,
  
  // 生产环境优化
  swcMinify: true,
  
  // 静态资源优化
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  
  // 重定向配置（如果需要）
  async redirects() {
    return [];
  },
  
  // 重写配置（如果需要）
  async rewrites() {
    return [];
  },
}

module.exports = nextConfig 