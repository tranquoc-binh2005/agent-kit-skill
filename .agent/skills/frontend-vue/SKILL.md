---
name: frontend-vue
description: Vue 3 / Nuxt 3 frontend development conventions. Use when working on Vue or Nuxt projects.
---

# Frontend Vue/Nuxt Conventions

This skill provides specific conventions for Vue 3 and Nuxt 3 frontend development.

## When to Use
- Use this skill when working on Vue 3 or Nuxt 3 projects
- Use this skill when creating new components, composables, or pages
- This skill builds upon `project-standards` skill

## Instructions

### 1. Syntax & Composition API

#### Script Setup (Mandatory)
Always use `<script setup lang="ts">`.

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  title: string;
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
});

const emit = defineEmits<{
  (e: 'update', value: number): void;
}>();

const localCount = ref(props.count);

const doubled = computed(() => localCount.value * 2);

function increment() {
  localCount.value++;
  emit('update', localCount.value);
}
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <p>Count: {{ localCount }} (Doubled: {{ doubled }})</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

### 2. Reactivity

- Use `ref` for primitives.
- Use `reactive` for objects.
- Be careful with destructuring `reactive` (use `toRefs`).

```typescript
// Primitives
const count = ref(0);
const isLoading = ref(false);

// Objects
const user = reactive({
  name: '',
  email: '',
});

// Destructuring reactive (use toRefs)
const { name, email } = toRefs(user);
```

### 3. Nuxt 3 Structure

```
project/
├── app.vue
├── pages/
│   ├── index.vue              # /
│   ├── users/
│   │   ├── index.vue          # /users
│   │   └── [id].vue           # /users/:id
├── components/
│   ├── Base/
│   │   ├── BaseButton.vue
│   │   └── BaseInput.vue
│   └── User/
│       └── UserCard.vue
├── composables/
│   ├── useAuth.ts
│   └── useApi.ts
├── server/
│   └── api/
│       └── users.ts
└── stores/
    └── user.ts
```

### 4. Auto-imports (Nuxt)

Leverage Nuxt's auto-import. Do not manually import unless necessary.

```vue
<script setup lang="ts">
// These are auto-imported in Nuxt
const route = useRoute();
const { data } = await useFetch('/api/users');

// Composables are also auto-imported
const { user, login } = useAuth();
</script>
```

### 5. Composables

Extract logic into `composables/useFeature.ts`.

```typescript
// composables/useCounter.ts
export function useCounter(initialValue = 0) {
  const count = ref(initialValue);

  function increment() {
    count.value++;
  }

  function decrement() {
    count.value--;
  }

  return {
    count: readonly(count),
    increment,
    decrement,
  };
}
```

### 6. State Management (Pinia)

Use Setup Stores syntax.

```typescript
// stores/user.ts
export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const isAuthenticated = computed(() => !!user.value);

  async function login(credentials: Credentials) {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: credentials,
    });
    user.value = response.user;
  }

  function logout() {
    user.value = null;
  }

  return {
    user: readonly(user),
    isAuthenticated,
    login,
    logout,
  };
});
```

### 7. Components

#### Naming
PascalCase for component filenames.

```
components/
├── BaseButton.vue       # <BaseButton />
├── UserCard.vue         # <UserCard />
└── TheHeader.vue        # <TheHeader /> (singleton)
```

#### Emits
Clearly define with typed interfaces.

```vue
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'submit', data: FormData): void;
  (e: 'cancel'): void;
}>();
</script>
```

### 8. Server Routes (Nuxt)

```typescript
// server/api/users.get.ts
export default defineEventHandler(async (event) => {
  const users = await prisma.user.findMany();
  
  return {
    success: true,
    data: users,
  };
});

// server/api/users.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  const user = await prisma.user.create({
    data: body,
  });
  
  return {
    success: true,
    data: user,
  };
});
```

### 9. Dependencies

- **Styling:** Tailwind CSS
- **State:** Pinia
- **Validation:** Zod or Valibot
- **UI:** Nuxt UI or PrimeVue
