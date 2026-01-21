# CI/CD Standards (GitHub Actions / GitLab CI)

## 1. Pipeline Stages
The pipeline must follow this strict order:
1.  **Lint & Static Analysis:** Fail fast if code style violates rules.
2.  **Test:** Run Unit Tests. (Block merge if failed).
3.  **Build:** Verify the application builds successfully.
4.  **Deploy (CD):** Only on `main` or `develop` branches.

## 2. Optimization
*   **Caching:** CACHE dependencies (`node_modules`, `vendor`, `.cache`) to speed up runs.
*   **Parallelism:** Run unrelated jobs (Lint frontend, Lint backend) in parallel.

## 3. Secrets Management
*   **CI Variables:** NEVER print secrets/tokens in logs. Use the CI platform's Secret masking features.
*   **Least Privilege:** CI tokens should only have permissions required for that specific workflow.
