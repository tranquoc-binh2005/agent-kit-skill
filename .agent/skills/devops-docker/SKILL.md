---
name: devops-docker
description: Docker containerization best practices. Use when creating Dockerfiles or docker-compose configurations.
---

# DevOps Docker Standards

This skill provides Docker containerization best practices.

## When to Use
- Use this skill when creating or modifying Dockerfiles
- Use this skill when setting up docker-compose configurations
- Use this skill when optimizing container images

## Instructions

### 1. Dockerfile Best Practices

#### Multi-Stage Builds (Mandatory)
ALWAYS use multi-stage builds to minimize final image size.

```dockerfile
# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

USER appuser

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

#### Base Images
- Use `alpine` or `slim` versions (e.g., `node:20-alpine`).
- **NEVER** use `:latest` tag.
- Pin specific versions for reproducibility.

```dockerfile
# Good
FROM node:20.10.0-alpine

# Bad
FROM node:latest
```

#### User Permissions
Implement a non-root user for security.

```dockerfile
RUN addgroup --system --gid 1001 appgroup
RUN adduser --system --uid 1001 appuser
USER appuser
```

### 2. Layer Optimization

Order instructions from least to most frequently changed.

```dockerfile
# Good order (least changed first)
FROM node:20-alpine

WORKDIR /app

# Dependencies change less often
COPY package*.json ./
RUN npm ci --only=production

# Source changes more often
COPY . .

CMD ["node", "index.js"]
```

### 3. .dockerignore (Mandatory)

Create `.dockerignore` to exclude unnecessary files.

```
# .dockerignore
.git
.gitignore
node_modules
npm-debug.log
Dockerfile
docker-compose*.yml
.env
.env.*
*.md
.vscode
.idea
coverage
dist
.next
```

### 4. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    container_name: myapp-api
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      db:
        condition: service_healthy
    networks:
      - app-network
    restart: unless-stopped

  db:
    container_name: myapp-db
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  postgres-data:
```

### 5. Key Docker Compose Rules

- **Naming:** Explicitly name containers (`container_name: my-app-api`).
- **Networks:** Define a custom bridge network; do not use the default.
- **Healthchecks:** Define for dependent services.
- **Volumes:** Use named volumes for data persistence.
- **Restart Policy:** Use `unless-stopped` or `always`.

### 6. Environment Variables

Never hardcode secrets. Use `.env` file passing.

```yaml
# docker-compose.yml
services:
  api:
    env_file:
      - .env
    environment:
      # Override or add specific vars
      - NODE_ENV=production
```

Create `.env.example` for documentation:

```
# .env.example
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
JWT_SECRET=your-secret-here
```

### 7. Production Checklist

- [ ] Multi-stage build used
- [ ] Non-root user configured
- [ ] Specific image versions (no `:latest`)
- [ ] .dockerignore present
- [ ] Health checks defined
- [ ] Resource limits set (optional but recommended)
- [ ] Secrets not hardcoded
