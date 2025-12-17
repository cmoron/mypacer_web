# Multi-stage build for mypacer_web (Svelte + Vite)
# - base: install dependencies
# - builder: compile static assets with Vite (intermediate stage)
# - prod: serve pre-built assets with Nginx (default)
# - dev: hot-reload development server with Vite

# =============================================================================
# Base image with dependencies
# =============================================================================
FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm ci

# =============================================================================
# Builder stage (intermediate - used only by prod)
# =============================================================================
FROM base AS builder

# Default API endpoint can be overridden at build time:
# docker build --target prod --build-arg VITE_API_URL=https://api.mypacer.fr .
ARG VITE_API_URL=https://api.mypacer.fr
ENV VITE_API_URL=${VITE_API_URL}

COPY . .

RUN npm run build

# =============================================================================
# Production image (default)
# =============================================================================
FROM nginx:1.27-alpine AS prod

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]

# =============================================================================
# Development image (inherits from base)
# Runs Vite dev server with hot-reload.
# Source code is provided via volume mount in docker-compose.
# Environment variables are read from .env file at runtime.
# =============================================================================
FROM base AS dev

# Copy only the source code structure (volumes will override in docker-compose)
COPY . .

EXPOSE 5173

# Vite dev server with host 0.0.0.0 to accept connections from outside container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
