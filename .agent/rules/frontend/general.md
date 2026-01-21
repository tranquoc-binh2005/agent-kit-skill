# Frontend General Rules

> Applicable to all Frontend projects (React, Vue, Angular...)

## 1. CSS Rules
*   Mandatory: **Tailwind CSS**.
*   Prohibited: Inline Styles, CSS Modules (except for special cases).
*   Class Naming: BEM is not mandatory if using Tailwind, but component logic must be clear.

## 2. Performance
*   **Images:** Must use the framework's optimized `<Image>` tag (Next/Nuxt Image).
*   **Lighthouse:** Performance score must be >= 90.

## 3. State Management
*   Server State: Use TanStack Query (React Query).
*   Client State: Keep local as much as possible. Limit Global Store.
