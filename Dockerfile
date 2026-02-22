# ARG for version tracking
ARG APP_VERSION=edge

# ==========================================
# Stage 1: Install & Build
# ==========================================
FROM oven/bun:1-alpine AS builder

# Build-time env vars for Vite (PUBLIC_ prefix)
ARG PUBLIC_API_URL=http://127.0.0.1:3001
ARG PUBLIC_GOOGLE_MAPS_KEY
ARG PUBLIC_SITE_URL

ENV PUBLIC_API_URL=${PUBLIC_API_URL}
ENV PUBLIC_GOOGLE_MAPS_KEY=${PUBLIC_GOOGLE_MAPS_KEY}
ENV PUBLIC_SITE_URL=${PUBLIC_SITE_URL}

WORKDIR /app

# Copy dependency manifests
COPY package.json ./

# Install dependencies
# Note: bun.lock is gitignored in this repo, so we cannot use --frozen-lockfile
RUN bun install

# Copy source code
COPY . .

# Build Vue SPA (generates dist/)
RUN bun run build

# ==========================================
# Stage 2: Production Runtime (Nginx)
# ==========================================
FROM nginx:stable-alpine AS runner

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Metadata
ARG APP_VERSION
LABEL org.opencontainers.image.version=${APP_VERSION}
LABEL org.opencontainers.image.title="Dashboard SPA"
LABEL org.opencontainers.image.vendor="DevBoards"

# Expose port
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Nginx runs as daemon off by default in the official image
CMD ["nginx", "-g", "daemon off;"]
