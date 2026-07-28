FROM node:20-bookworm-slim AS deps
WORKDIR /app
# 使用国内 Debian 镜像，减少服务器访问官方源的等待时间
RUN sed -i \
    -e 's|deb.debian.org/debian|mirrors.aliyun.com/debian|g' \
    -e 's|deb.debian.org/debian-security|mirrors.aliyun.com/debian-security|g' \
    -e 's|security.debian.org/debian-security|mirrors.aliyun.com/debian-security|g' \
    /etc/apt/sources.list.d/debian.sources \
  && apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json* ./
RUN npm config set registry https://registry.npmmirror.com \
  && npm install --no-audit --no-fund

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=4000 \
    DB_PATH=/app/data/engagement.db
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
RUN mkdir -p /app/data
EXPOSE 4000
CMD ["npm", "start"]
