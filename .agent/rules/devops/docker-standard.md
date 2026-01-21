# Docker Standards

## 1. Dockerfile Best Practices
*   **Multi-Stage Builds:** ALWAYS use multi-stage builds to minimize final image size.
    *   *Stage 1:* Builder (install deps, compile).
    *   *Stage 2:* Runner (copy only artifacts, production deps).
*   **Base Images:** Use `alpine` or `slim` versions (e.g., `node:18-alpine`). Avoid `:latest`.
*   **User Permissions:** Implement a non-root user (e.g., `USER node`) for security.
*   **.dockerignore:** Must exist. Ignore `.git`, `node_modules`, `dist`, local env files.

## 2. Docker Compose
*   **Naming:** Explicitly name containers (`container_name: my-app-api`) for easier debugging.
*   **Networks:** Define a custom bridge network; do not use the default bridge.
*   **Healthchecks:** Define `healthcheck` for dependent services (e.g., wait for DB to be healthy).

## 3. Environment Variables
*   **Injection:** Never hardcode secrets. Use `.env` file passing.
*   **Defaults:** Provide safe defaults in `ENV` instructions or a separate `.env.example`.
