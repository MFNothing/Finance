#!/bin/bash

# 金融数据项目 Docker 部署脚本

echo "🚀 开始部署金融数据项目..."

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 docker-compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose 未安装，请先安装 docker-compose"
    exit 1
fi

# 检查环境变量文件
if [ ! -f .env ]; then
    echo "⚠️  未找到 .env 文件，请创建 .env 文件并设置以下环境变量："
    echo "   NEXT_PUBLIC_FINMIND_TOKEN=your_finmind_token_here"
    echo "   NODE_ENV=production"
    echo "   PORT=3010"
    exit 1
fi

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose down

# 构建新镜像
echo "🔨 构建 Docker 镜像..."
docker-compose build --no-cache

# 启动服务
echo "🚀 启动服务..."
docker-compose up -d

# 检查服务状态
echo "📊 检查服务状态..."
sleep 10
docker-compose ps

# 检查健康状态
echo "🏥 检查健康状态..."
docker-compose exec finance-app curl -f http://localhost:3010 || echo "⚠️  健康检查失败，请检查日志"

echo "✅ 部署完成！"
echo "🌐 访问地址: http://localhost:3010"
echo "📝 查看日志: docker-compose logs -f finance-app" 