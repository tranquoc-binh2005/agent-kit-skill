# Next.js Specific Conventions

## 1. App Router Strategy
*   **Default to Server Components:** All components in `app/` are Server Components by default. Only add `"use client"` when interactivity (onClick, useState, useEffect) is strictly needed.
*   **Data Fetching:** Fetch data directly in Server Components using `async/await`. Avoid `useEffect` for data fetching.

## 2. File Structure & Naming
*   **Route Groups:** Use `(auth)`, `(dashboard)` to organize routes without affecting the URL path.
*   **Private Folders:** Use `_components` or `_utils` to exclude folders from routing.
*   **Filenames:**
    *   `page.tsx`: Route UI.
    *   `layout.tsx`: Shared UI (wrappers).
    *   `loading.tsx`: Loading states (Suspense).
    *   `error.tsx`: Error boundary.

## 3. Performance & Optimization
*   **Images:** STRICTLY use `next/image` with strictly defined width/height or fill.
*   **Fonts:** Use `next/font` to optimize loading and prevent layout shift.
*   **Server Actions:** Use Server Actions for form submissions and simple mutations instead of creating dedicated API Routes.

## 4. State Management
*   **URL as State:** Prioritize storing search parameters (filters, pagination) in the URL (`searchParams`) rather than local state.
