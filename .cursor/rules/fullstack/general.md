# Fullstack General Rules

> **Goal:** Build cohesive full-stack applications with consistent patterns across frontend and backend.

---

## 1. API Contract First

### OpenAPI Specification (Required)
```yaml
openapi: 3.0.3
info:
  title: API Specification
  version: 1.0.0
paths:
  /users:
    get:
      summary: List users
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
```

### Rules
- ✅ **API spec first** - Define OpenAPI before coding
- ✅ **Generate types** - Use openapi-generator for FE/BE types
- ✅ **Keep in sync** - Spec is single source of truth
- ❌ Never manually duplicate types between FE/BE

---

## 2. Monorepo Structure

### Recommended Layout
```
project-root/
├── apps/
│   ├── web/                 # Frontend (Next.js, Vue, etc.)
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── api/                 # Backend (NestJS, Express, etc.)
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── shared/              # Shared types, constants
│   │   ├── src/
│   │   │   ├── types/       # Generated from OpenAPI
│   │   │   ├── constants/   # Shared constants
│   │   │   └── utils/       # Shared utilities
│   │   └── package.json
│   ├── ui/                  # Shared UI components (optional)
│   └── eslint-config/       # Shared ESLint config
├── docker-compose.yml
├── turbo.json               # Turborepo config
└── package.json
```

### Workspace Tools
- **Turborepo** - Build caching, task orchestration
- **pnpm** - Fast, disk-efficient package manager
- **TypeScript Project References** - Type safety across packages

---

## 3. Shared Types Strategy

### Type Generation Flow
```
OpenAPI Spec (api.yaml)
        ↓
   openapi-generator
        ↓
  packages/shared/types/
        ↓
    ┌───────┴───────┐
    ↓               ↓
 apps/web       apps/api
```

### Example Shared Types
```typescript
// packages/shared/src/types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
}

export interface UserListResponse {
  success: boolean;
  data: User[];
  meta: PaginationMeta;
}
```

---

## 4. Authentication Flow

### JWT Token Strategy
```
┌──────────┐         ┌──────────┐         ┌──────────┐
│  Client  │ ──1───▶ │   API    │ ──2───▶ │   DB     │
└──────────┘         └──────────┘         └──────────┘
     │                    │
     │◀──────3───────────│ Access Token (15min)
     │                    │ Refresh Token (7days)
     │
     │ Store:
     │ - Access: Memory/State
     │ - Refresh: HttpOnly Cookie
```

### Token Storage Rules
| Token | Web Storage | Mobile Storage |
|-------|-------------|----------------|
| **Access** | Memory/State | Secure Storage |
| **Refresh** | HttpOnly Cookie | Secure Storage |

### CORS Configuration
```typescript
// Backend CORS setup
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true, // Required for cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
```

---

## 5. Environment Configuration

### Environment Variables Structure
```bash
# apps/web/.env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=MyApp

# apps/api/.env
DATABASE_URL=postgresql://localhost:5432/myapp
JWT_SECRET=super-secret-key
FRONTEND_URL=http://localhost:3000
```

### Rules
- ✅ **Prefix public vars** - `NEXT_PUBLIC_`, `VITE_` for frontend
- ✅ **Separate env files** - Different for web/api
- ✅ **.env.example** - Document all required vars
- ❌ Never expose backend secrets to frontend

---

## 6. API Client Pattern

### Type-Safe API Client (Frontend)
```typescript
// packages/shared/src/api-client.ts
import type { User, CreateUserRequest } from './types';

class ApiClient {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  async getUsers(): Promise<User[]> {
    const res = await fetch(`${this.baseUrl}/users`, {
      credentials: 'include',
    });
    const data = await res.json();
    return data.data;
  }
  
  async createUser(payload: CreateUserRequest): Promise<User> {
    const res = await fetch(`${this.baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data.data;
  }
}

export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL!);
```

---

## 7. Error Handling Consistency

### Error Format (Both FE & BE)
```typescript
// Shared error interface
interface ApiError {
  code: string;          // Machine-readable: USER_NOT_FOUND
  message: string;       // Human-readable: "User not found"
  details?: ErrorDetail[];
}

// Frontend error handling
try {
  await apiClient.createUser(data);
} catch (error) {
  if (error.code === 'USER_ALREADY_EXISTS') {
    // Show specific message
  } else {
    // Show generic error
  }
}
```

---

## 8. Development Workflow

### Local Development
```bash
# Start all services
pnpm dev

# Start specific service
pnpm --filter web dev
pnpm --filter api dev

# Run in Docker
docker-compose up
```

### Database Migrations
```bash
# Generate migration
pnpm --filter api migration:generate

# Run migrations
pnpm --filter api migration:run

# Seed data
pnpm --filter api seed
```

### Testing Strategy
| Layer | Test Type | Tools |
|-------|-----------|-------|
| **API** | Unit, Integration, E2E | Jest, Supertest |
| **Web** | Unit, Integration | Vitest, Testing Library |
| **E2E** | Full flow | Playwright, Cypress |

---

## 9. Deployment Strategy

### Environment Flow
```
Feature Branch → develop → staging → main → production
     │              │         │        │
   Local Dev    CI Tests   QA Test   Release
```

### Docker Compose for Development
```yaml
version: '3.8'

services:
  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./apps/web:/app
      - /app/node_modules
    environment:
      - NEXT_PUBLIC_API_URL=http://api:3001

  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile.dev
    ports:
      - "3001:3001"
    volumes:
      - ./apps/api:/app
      - /app/node_modules
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp

  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```
