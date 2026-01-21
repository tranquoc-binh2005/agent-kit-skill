# Laravel Specific Conventions

## 1. Architecture & Design Pattern
*   **Service Layer:** Complex Business Logic must be separated into Service Classes, do not write in Controllers.
    *   Path: `app/Services/{Name}Service.php`
*   **Repository Pattern:** (Optional) Use when strict separation of DB query logic is needed.
    *   Path: `app/Repositories/{Name}Repository.php`
*   **Form Request:** Must use FormRequest to validate input, do not validate directly in the Controller.

## 2. Coding Style (PSR-12)
*   Strictly adhere to PSR-12.
*   Use **Strict Types** (`declare(strict_types=1);`) at the beginning of new PHP files.
*   **Naming:**
    *   Controller: `UserController` (Singular)
    *   Model: `User` (Singular)
    *   Table: `users` (Plural)
    *   Variable: `$camelCase`

## 3. Best Practices
*   **Eloquent:** Prioritize using Eloquent Relationships instead of manual Query Builder.
*   **N+1 Problem:** Always Eager Load (`with()`) when querying relationships.
*   **API Resource:** Use API Resource to transform data returned as JSON.
