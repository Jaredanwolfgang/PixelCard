# ---------- deps ----------
FROM node:20-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm config set registry https://registry.npmmirror.com \
  && npm ci --no-audit --no-fund || npm install --no-audit --no-fund

# ---------- build ----------
FROM node:20-bookworm-slim AS builder
WORKDIR /app
ARG ENGAGEMENT_URL=http://server:4000
ARG PIXELCARD_LIMITED_BUILD=0
ARG BUILD_NODE_OPTIONS=--max-old-space-size=768
ENV NEXT_TELEMETRY_DISABLED=1 \
    ENGAGEMENT_URL=${ENGAGEMENT_URL} \
    PIXELCARD_LIMITED_BUILD=${PIXELCARD_LIMITED_BUILD} \
    NODE_OPTIONS=${BUILD_NODE_OPTIONS} \
    RAYON_NUM_THREADS=1 \
    UV_THREADPOOL_SIZE=1
COPY --from=deps /app/node_modules ./node_modules
COPY package.json next.config.mjs tsconfig.json next-env.d.ts ./
COPY public ./public
COPY src ./src
COPY content ./content
COPY site.config.yaml ./
RUN npm run build

# ---------- runner ----------
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    ENGAGEMENT_URL=http://server:4000

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/content ./content
COPY --from=builder /app/site.config.yaml ./
COPY --from=builder /app/next.config.mjs ./

EXPOSE 3000
CMD ["npm", "start"]
