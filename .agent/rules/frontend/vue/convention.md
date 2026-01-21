# Vue 3 / Nuxt 3 Specific Conventions

## 1. Syntax & Composition API
*   **Script Setup:** Mandatory usage of `<script setup lang="ts">`.
*   **Reactivity:** Use `ref` for primitives and `reactive` for objects. Be careful with destructuring `reactive` (use `toRefs`).

## 2. Nuxt 3 Structure
*   **Auto-imports:** Leverage Nuxt's auto-import feature for components and composables. Do not manually import unless necessary for type clarification.
*   **Composables:** Logic must be extracted into `composables/useFeature.ts`.
*   **Server:** Use `server/api` for backend logic.

## 3. State Management (Pinia)
*   **Setup Stores:** Use Setup Stores syntax (`defineStore` with ref/function) instead of Option Stores.
*   **Persist:** Use persisted-state plugins only for critical user preferences.

## 4. Components
*   **Naming:** PascalCase for component filenames (e.g., `BaseInput.vue`).
*   **Emits:** Clearly define `defineEmits` with typed interfaces.
