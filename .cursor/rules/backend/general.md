# Backend General Rules

> **Goal:** Build secure, scalable, and maintainable API applications.

---

## 1. RESTful API Standards

### HTTP Methods (MUST Follow)
| Method | Purpose | Idempotent | Safe |
|--------|---------|------------|------|
| `GET` | Read resource | ✅ | ✅ |
| `POST` | Create resource | ❌ | ❌ |
| `PUT` | Full update | ✅ | ❌ |
| `PATCH` | Partial update | ✅ | ❌ |
| `DELETE` | Remove resource | ✅ | ❌ |

### URL Naming
- ✅ Use **plural nouns** for collections: `/users`, `/orders`
- ✅ Use **kebab-case**: `/user-profiles`, `/order-items`
- ✅ Nested resources: `/users/{id}/orders`
- ❌ Never use verbs: `/getUsers`, `/createOrder`
- ❌ Max nesting: 2 levels (`/users/{id}/orders/{orderId}`)

---

## 2. Standard API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "John Doe"
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  },
  "timestamp": "2024-01-20T10:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with ID 123 not found",
    "details": []
  },
  "timestamp": "2024-01-20T10:00:00.000Z"
}
```

### HTTP Status Codes
| Code | When to Use |
|------|-------------|
| `200` | Successful GET, PUT, PATCH |
| `201` | Successful POST (created) |
| `204` | Successful DELETE (no content) |
| `400` | Validation error, bad request |
| `401` | Missing/invalid authentication |
| `403` | Authenticated but not authorized |
| `404` | Resource not found |
| `409` | Conflict (duplicate, state conflict) |
| `422` | Unprocessable entity (business logic error) |
| `500` | Internal server error |

---

## 3. Architecture Layers (Clean Architecture)

```
┌─────────────────────────────────────────┐
│           Controllers (HTTP)            │  ← Handle HTTP only
├─────────────────────────────────────────┤
│           Services (Business)           │  ← All business logic
├─────────────────────────────────────────┤
│         Repositories (Data)             │  ← Database access
├─────────────────────────────────────────┤
│              Entities                   │  ← Domain models
└─────────────────────────────────────────┘
```

### Layer Responsibilities
| Layer | Responsibility | What it MUST NOT do |
|-------|---------------|---------------------|
| **Controller** | Parse request, return response | ❌ Business logic, ❌ DB queries |
| **Service** | Business logic, orchestration | ❌ HTTP handling, ❌ Direct DB access |
| **Repository** | Data access, queries | ❌ Business logic |

---

## 4. Naming Conventions

### Code Naming
| Type | Backend (API) | Database |
|------|--------------|----------|
| **Variables** | `camelCase` | - |
| **Functions** | `camelCase` | - |
| **Classes** | `PascalCase` | - |
| **Tables** | - | `snake_case` |
| **Columns** | - | `snake_case` |
| **Endpoints** | `kebab-case` | - |

### File Naming
| File Type | Convention | Example |
|-----------|-----------|---------|
| **Entity** | `PascalCase` | `User.entity.ts` |
| **DTO** | `kebab-case` | `create-user.dto.ts` |
| **Service** | `kebab-case` | `user.service.ts` |
| **Controller** | `kebab-case` | `user.controller.ts` |
| **Repository** | `kebab-case` | `user.repository.ts` |

---

## 5. Error Handling

### Custom Error Codes (Domain-Specific)
```typescript
// Define error codes per domain
const ErrorCodes = {
  // Auth errors
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_FORBIDDEN: 'AUTH_FORBIDDEN',
  
  // User errors
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  
  // General errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
};
```

### Rules
- ✅ Use custom exception classes
- ✅ Global exception filter/middleware
- ✅ Log errors with correlation ID
- ❌ Never expose stack traces to client
- ❌ Never return generic "Something went wrong"

---

## 6. Security Best Practices

### Authentication & Authorization
- ✅ JWT with short expiry (15min access, 7day refresh)
- ✅ Refresh token rotation
- ✅ Store tokens in HttpOnly cookies (web) or secure storage (mobile)
- ✅ Role-based access control (RBAC)
- ❌ Never store passwords in plain text (use bcrypt/argon2)

### Input Validation
- ✅ Validate ALL inputs at controller layer
- ✅ Sanitize user input (XSS prevention)
- ✅ Use parameterized queries (SQL injection prevention)
- ✅ Rate limiting on public endpoints

---

## 7. Database Standards

### Required Fields (All Tables)
```sql
id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
deleted_at   TIMESTAMP WITH TIME ZONE  -- Soft delete
```

### Indexing Rules
- ✅ Index all foreign keys
- ✅ Index fields used in WHERE/ORDER BY
- ✅ Composite index for multi-column queries
- ❌ Don't over-index (affects write performance)

---

## 8. API Versioning

### URL-Based Versioning (Recommended)
```
/api/v1/users
/api/v2/users
```

### Rules
- ✅ Always version from the start (`/api/v1/`)
- ✅ Support at least 2 versions simultaneously
- ✅ Deprecation notice 3 months before sunset
- ✅ Document breaking changes in changelog

---

## 9. Folder Structure

```
src/
├── common/                    # Shared utilities
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── utils/
├── config/                    # Configuration
│   ├── database.config.ts
│   └── app.config.ts
├── modules/                   # Feature modules
│   ├── auth/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── guards/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   └── user/
└── main.ts
```
