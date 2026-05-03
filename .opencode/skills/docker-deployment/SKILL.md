---
name: docker-deployment
description: |-
  Docker containerization and deployment standards. Use when creating Dockerfiles, docker-compose files, or container deployment configurations. Use proactively for any project that needs to be containerized or deployed. Examples:
  - user: "create a Dockerfile for this app" → apply multi-stage build pattern
  - user: "deploy this on port 3000" → create Dockerfile + docker-compose
  - user: "containerize this service" → follow security hardening checklist
license: MIT
metadata:
  version: "1.0"
  applies-to: agent-executor, code-implementer
---

# Docker Deployment Standards

## Dockerfile Patterns

### Multi-Stage Build (Default Pattern)

Always use multi-stage builds to minimize final image size:

```dockerfile
# ── Stage 1: Build ──────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first (better layer caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy source and build
COPY . .
RUN npm run build

# ── Stage 2: Runtime ────────────────────────────────
FROM nginx:alpine AS runtime

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
```

### Node.js API Service Pattern

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

USER appuser

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "dist/index.js"]
```

## Docker Compose Template

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: runtime        # Specify the stage to use
    container_name: app-name
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    env_file:
      - .env                 # Sensitive config from env file
    volumes:
      - app-data:/app/data   # Named volume for persistent data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

volumes:
  app-data:
```

## Nginx Config for SPA (Single Page Application)

```nginx
server {
    listen 3000;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/javascript application/json;

    # Cache static assets
    location ~* \.(js|css|png|jpg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing — send all requests to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Health check endpoint
    location /health {
        return 200 'OK';
        add_header Content-Type text/plain;
    }
}
```

## Security Hardening Checklist

- [ ] Use official base images (node:alpine, nginx:alpine)
- [ ] Pin specific image versions (not `latest` in production)
- [ ] Run as non-root user inside container
- [ ] Use multi-stage build to exclude build tools from runtime image
- [ ] No secrets hardcoded in Dockerfile or docker-compose.yml
- [ ] Sensitive config passed via environment variables or secrets
- [ ] HEALTHCHECK defined for all long-running services
- [ ] Resource limits set for production deployments
- [ ] Unnecessary ports not exposed

## .dockerignore (Always Include)

```
node_modules
.git
.gitignore
*.md
.env*
dist
coverage
.nyc_output
*.log
.DS_Store
```

## Build and Run Commands

```bash
# Build image
docker build -t app-name:latest .

# Run with docker compose
docker compose up -d --build

# Check logs
docker compose logs -f

# Health check
docker compose ps

# Stop
docker compose down
```
