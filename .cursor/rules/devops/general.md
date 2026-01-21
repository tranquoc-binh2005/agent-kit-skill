# DevOps General Rules

> **Goal:** Build reliable, scalable, and secure infrastructure with automation.

---

## 1. Docker Standards

### Dockerfile Best Practices

```dockerfile
# Good: Multi-stage build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
# Run as non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
USER nodejs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://localhost:3000/health || exit 1
CMD ["node", "dist/main.js"]
```

### Docker Rules
- ✅ **Multi-stage builds** for smaller images
- ✅ **Non-root user** in production containers
- ✅ **Health checks** mandatory
- ✅ **Pin base image versions** (`node:20.10.0-alpine`, not `node:latest`)
- ✅ **.dockerignore** file required
- ❌ Never store secrets in Dockerfile
- ❌ Never run as root in production

### Required .dockerignore
```
node_modules
.git
.env
.env.*
*.log
dist
coverage
.nyc_output
```

---

## 2. Docker Compose Standards

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

---

## 3. CI/CD Pipeline Standards

### Pipeline Stages (Required Order)
```
1. Lint      → Code quality checks
2. Test      → Unit & Integration tests
3. Build     → Create artifacts
4. Security  → Vulnerability scanning
5. Deploy    → Environment deployment
```

### GitHub Actions Example
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:cov
      - uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/build-push-action@v5
        with:
          context: .
          push: false
          tags: app:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

---

## 4. Environment Management

### Environment Separation
| Environment | Purpose | Branch |
|-------------|---------|--------|
| `development` | Local development | feature/* |
| `staging` | Pre-production testing | develop |
| `production` | Live system | main |

### Secrets Management
- ✅ Use **environment variables** for all secrets
- ✅ Use **secret managers** (AWS Secrets Manager, HashiCorp Vault)
- ✅ Different secrets per environment
- ❌ Never commit `.env` files
- ❌ Never hardcode secrets in code

### Required .env.example
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
DATABASE_POOL_SIZE=10

# Auth
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=15m

# External Services
REDIS_URL=redis://localhost:6379
S3_BUCKET=your-bucket-name

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx
```

---

## 5. Monitoring & Logging

### Structured Logging (JSON Format)
```json
{
  "timestamp": "2024-01-20T10:00:00.000Z",
  "level": "info",
  "message": "User created successfully",
  "correlationId": "abc-123-def",
  "userId": "user-456",
  "duration": 45,
  "service": "user-service"
}
```

### Required Endpoints
| Endpoint | Purpose | Response |
|----------|---------|----------|
| `GET /health` | Liveness probe | `{ "status": "ok" }` |
| `GET /ready` | Readiness probe | Checks DB, Redis, etc. |
| `GET /metrics` | Prometheus metrics | Prometheus format |

### Health Check Response
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:00:00.000Z",
  "version": "1.2.3",
  "checks": {
    "database": { "status": "up", "latency": "5ms" },
    "redis": { "status": "up", "latency": "2ms" }
  }
}
```

---

## 6. Infrastructure as Code

### Terraform Standards
```hcl
# Good: Use modules and variables
module "vpc" {
  source  = "./modules/vpc"
  
  environment = var.environment
  cidr_block  = var.vpc_cidr
  
  tags = local.common_tags
}

# Always use variables for reusability
variable "environment" {
  type        = string
  description = "Environment name (dev, staging, prod)"
}

# Use locals for computed values
locals {
  common_tags = {
    Environment = var.environment
    ManagedBy   = "terraform"
    Project     = var.project_name
  }
}
```

### IaC Rules
- ✅ All infrastructure in code (no manual changes)
- ✅ Version control all configs
- ✅ Use modules for reusability
- ✅ State file in remote backend (S3, GCS)
- ✅ State locking enabled
- ❌ Never commit tfstate files

---

## 7. Kubernetes Basics

### Deployment Template
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  labels:
    app: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: api:1.0.0
          ports:
            - containerPort: 3000
          resources:
            requests:
              memory: "128Mi"
              cpu: "100m"
            limits:
              memory: "256Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
```

### K8s Rules
- ✅ Always set resource requests/limits
- ✅ Always include probes (liveness, readiness)
- ✅ Use ConfigMaps for non-sensitive config
- ✅ Use Secrets for sensitive data
- ✅ Use namespaces for environment separation
