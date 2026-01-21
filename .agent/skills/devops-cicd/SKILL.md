---
name: devops-cicd
description: CI/CD pipeline best practices for GitHub Actions and GitLab CI. Use when setting up or modifying CI/CD pipelines.
---

# DevOps CI/CD Standards

This skill provides CI/CD pipeline best practices.

## When to Use
- Use this skill when creating GitHub Actions workflows
- Use this skill when setting up GitLab CI pipelines
- Use this skill when optimizing build/deploy processes

## Instructions

### 1. Pipeline Stages

The pipeline must follow this strict order:
1. **Lint & Static Analysis:** Fail fast if code style violates rules.
2. **Test:** Run Unit Tests. (Block merge if failed).
3. **Build:** Verify the application builds successfully.
4. **Deploy (CD):** Only on `main` or `develop` branches.

### 2. GitHub Actions Example

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '20'

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Run TypeScript check
        run: npm run type-check

  test:
    name: Test
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:ci
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        if: always()

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/

  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - uses: actions/checkout@v4
      
      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/
      
      - name: Deploy to production
        run: |
          # Deploy commands here
          echo "Deploying to production..."
```

### 3. Optimization

#### Caching
CACHE dependencies to speed up runs.

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'  # Automatically caches node_modules
```

#### Parallelism
Run unrelated jobs in parallel.

```yaml
jobs:
  lint-frontend:
    runs-on: ubuntu-latest
    # ...

  lint-backend:
    runs-on: ubuntu-latest
    # ...

  test:
    needs: [lint-frontend, lint-backend]  # Runs after both complete
    # ...
```

### 4. Secrets Management

#### Rules
- **NEVER** print secrets/tokens in logs.
- Use the CI platform's Secret masking features.
- **Least Privilege:** CI tokens should only have required permissions.

```yaml
# Good - Using secrets
- name: Deploy
  env:
    API_KEY: ${{ secrets.API_KEY }}
  run: ./deploy.sh

# Bad - Printing secrets
- name: Debug
  run: echo ${{ secrets.API_KEY }}  # NEVER DO THIS
```

### 5. Branch Protection

```yaml
# Only deploy from protected branches
deploy:
  if: github.ref == 'refs/heads/main'
  
# Or use environment protection
deploy:
  environment: production  # Requires approval if configured
```

### 6. GitLab CI Example

```yaml
# .gitlab-ci.yml
stages:
  - lint
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "20"

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/

lint:
  stage: lint
  image: node:${NODE_VERSION}-alpine
  script:
    - npm ci
    - npm run lint
    - npm run type-check

test:
  stage: test
  image: node:${NODE_VERSION}-alpine
  script:
    - npm ci
    - npm run test:ci
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'

build:
  stage: build
  image: node:${NODE_VERSION}-alpine
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week

deploy:
  stage: deploy
  image: node:${NODE_VERSION}-alpine
  script:
    - echo "Deploying..."
  environment:
    name: production
  only:
    - main
  when: manual
```

### 7. Best Practices Checklist

- [ ] Lint runs before tests
- [ ] Tests run before build
- [ ] Build artifacts are cached/uploaded
- [ ] Secrets are never logged
- [ ] Dependencies are cached
- [ ] Deploy only from protected branches
- [ ] Environment approvals for production
