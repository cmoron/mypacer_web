# Docker Development Setup

## Overview

MyPacer Web now supports both production and development Docker workflows, aligned with the patterns used in `mypacer_api` and `mypacer_scraper`.

## Architecture

### Multi-Stage Dockerfile

The `Dockerfile` defines three targets:

1. **`base`** - Base image with Node.js dependencies installed
2. **`builder`** - Intermediate stage that builds static assets (used only by prod)
3. **`prod`** - Production image serving pre-built assets via Nginx
4. **`dev`** - Development image running Vite dev server with hot-reload

```
┌─────────────────────────────────────────────────────────────┐
│                         Dockerfile                          │
├─────────────────────────────────────────────────────────────┤
│  base (node:20-alpine)                                      │
│    ├─ npm ci (install dependencies)                         │
│    └─ WORKDIR /app                                          │
│                                                             │
│  builder (FROM base)                                        │
│    ├─ ARG VITE_API_URL (build-time variable)                │
│    ├─ npm run build                                         │
│    └─ Output: /app/dist                                     │
│                                                             │
│  prod (nginx:1.27-alpine)                                   │
│    ├─ COPY --from=builder /app/dist                         │
│    ├─ nginx.conf                                            │
│    ├─ EXPOSE 80                                             │
│    └─ CMD ["nginx", "-g", "daemon off;"]                    │
│                                                             │
│  dev (FROM base)                                            │
│    ├─ COPY . . (source code)                                │
│    ├─ EXPOSE 5173                                           │
│    └─ CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]  │
└─────────────────────────────────────────────────────────────┘
```

## Development Workflow

### Running Locally with Docker Compose

```bash
cd mypacer_web
docker compose -f docker-compose.dev.yml up --build
```

**What this does:**

- Builds the `dev` target from the Dockerfile
- Mounts source code as a volume for hot-reload
- Reads `.env` file at runtime (no build-time baking)
- Exposes port 5173 on the host
- Starts Vite dev server with `--host 0.0.0.0`

**Access:**

- Application: http://localhost:5173
- API endpoint: Configured via `VITE_API_URL` in `.env` (default: `http://localhost:8000`)

### File: docker-compose.dev.yml

```yaml
services:
  web:
    build:
      context: .
      target: dev
    container_name: mypacer-web-dev
    env_file: .env
    ports:
      - '5173:5173'
    volumes:
      - .:/app # Mount source code for hot reload
      - /app/node_modules # Preserve node_modules from image
    command: npm run dev -- --host 0.0.0.0
    stdin_open: true
    tty: true
```

**Key features:**

- **Volume mounts**: Source code changes trigger hot-reload
- **Preserved node_modules**: Using anonymous volume to avoid host/container conflicts
- **Environment variables**: Read from `.env` at runtime (not build-time)

### Environment Configuration

**Development (.env):**

```bash
VITE_API_URL=http://localhost:8000
```

**Production (.env.production):**

```bash
VITE_API_URL=/api
```

In development, Vite reads `.env` automatically. In production, the URL is baked during build via `ARG VITE_API_URL`.

## Production Workflow

### Building Production Image

```bash
docker build --target prod -t mypacer_web:latest-prod \
  --build-arg VITE_API_URL=https://api.mypacer.fr .
```

**What this does:**

- Uses `builder` stage to run `npm run build`
- Passes `VITE_API_URL` as build argument (baked into static files)
- Creates minimal Nginx image serving `/app/dist`
- Exposes port 80

### Running Production Container

```bash
docker run -p 8080:80 mypacer_web:latest-prod
```

**Access:**

- Application: http://localhost:8080

## Key Differences: Dev vs Prod

| Aspect                | Development (`dev` target) | Production (`prod` target) |
| --------------------- | -------------------------- | -------------------------- |
| **Base Image**        | node:20-alpine             | nginx:1.27-alpine          |
| **Port**              | 5173                       | 80                         |
| **API URL**           | Runtime (from `.env`)      | Build-time (from `ARG`)    |
| **Hot Reload**        | ✅ Yes (Vite dev server)   | ❌ No (static files)       |
| **Build Step**        | ❌ No build                | ✅ `npm run build`         |
| **Source Code**       | Volume-mounted             | Copied at build time       |
| **Image Size**        | Larger (~500MB)            | Smaller (~50MB)            |
| **Restart on Change** | ❌ Auto hot-reload         | ✅ Requires rebuild        |

## Troubleshooting

### Dev Server Not Accessible

**Problem:** Cannot access http://localhost:5173

**Solutions:**

- Check port 5173 is not already in use: `lsof -i :5173`
- Verify container is running: `docker ps | grep mypacer-web-dev`
- Check logs: `docker logs mypacer-web-dev`

### API Connection Refused

**Problem:** Frontend shows "Failed to fetch" errors

**Solutions:**

- Verify API is running on `http://localhost:8000`
- Check `.env` file contains `VITE_API_URL=http://localhost:8000`
- Restart dev server to pick up `.env` changes

### Hot Reload Not Working

**Problem:** Code changes don't trigger browser refresh

**Solutions:**

- Verify volume mount: `docker inspect mypacer-web-dev | grep Mounts -A 10`
- Check Vite logs for file watcher errors
- On WSL2/Windows: May need polling mode in `vite.config.js`:
  ```js
  export default defineConfig({
    server: {
      watch: {
        usePolling: true,
      },
    },
  });
  ```

### Wrong API URL in Production Build

**Problem:** Production image still points to `https://api.mypacer.fr` instead of custom URL

**Solution:** Pass build argument explicitly:

```bash
docker build --target prod --build-arg VITE_API_URL=https://custom.api.url .
```

## Integration with mypacer_infra

The `mypacer_infra` repository orchestrates all services in production via `docker-compose.prod.yml`. It pulls pre-built images from GHCR.

**Future enhancement:** Create `docker-compose.dev.yml` in `mypacer_infra` to orchestrate all three services (API, Scraper, Web) in development mode.

Example:

```yaml
services:
  db:
    image: postgres:16
    # ... db config ...

  api:
    build:
      context: ../mypacer_api
      target: dev
    # ... api config ...

  web:
    build:
      context: ../mypacer_web
      target: dev
    depends_on:
      - api
    # ... web config ...
```

## References

- Vite documentation: https://vitejs.dev/guide/
- Docker multi-stage builds: https://docs.docker.com/build/building/multi-stage/
- Similar setup in `mypacer_api`: ../mypacer_api/Dockerfile
- Similar setup in `mypacer_scraper`: ../mypacer_scraper/Dockerfile
