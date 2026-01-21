# Backend General Rules

> Applicable to all Backend projects (Node, Python, Go, PHP...)

## 1. RESTful API Standard (Strict)

### A. HTTP Verbs & Semantics
*   `GET` - Read resources. (Idempotent, Safe). Never change state.
*   `POST` - Create new resources.
*   `PUT` - **Full Update**. Replaces the entire resource.
*   `PATCH` - **Partial Update**. Changes specific fields.
*   `DELETE` - Remove resources.

### B. Status Codes
*   `200 OK`: Success (Read/Update).
*   `201 Created`: Success (Create - Must return Location header if possible).
*   `204 No Content`: Success (Delete) or Action without result.
*   `400 Bad Request`: Validation Failures (Client Error).
*   `401 Unauthorized`: Authentication missing/invalid.
*   `403 Forbidden`: Authenticated but no permission.
*   `404 Not Found`: Resource does not exist.
*   `500 Internal Server Error`: Application crash (Should be monitored).

### C. Response Wrapper (Envelope)
All responses must strictly follow this JSON format:
```json
{
  "success": true, // or false
  "data": { ... }, // Object or Array
  "meta": {        // Optional: Pagination info
    "page": 1,
    "limit": 10,
    "total": 100
  },
  "error": {       // Null if success: true
    "code": "USER_NOT_FOUND",
    "message": "User with ID 123 does not exist.",
    "details": []  // Validation field errors
  },
  "timestamp": "2024-01-20T10:00:00Z"
}
```

### D. URL Naming (Kebab-case)
*   Collection: `/users` (Plural)
*   Resource: `/users/123`
*   Sub-resource: `/users/123/orders` (Not `/get-user-orders`)

## 2. Database Standards
*   **Naming:** `snake_case` for table/columns.
*   **Primary Keys:** UUID (preferred for distributed) or BigInt auto-increment.
*   **Audit Fields:** `created_at`, `updated_at`, `deleted_at` (Soft Delete) are mandatory for core entities.

## 3. Logging & Monitoring
*   **No Sensitive Data:** Mask passwords/tokens before logging.
*   **Structured Logging:** Log in JSON format for parsing (e.g., Datadog/ELK).
