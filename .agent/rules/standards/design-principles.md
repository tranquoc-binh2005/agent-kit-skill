# Software Design Principles

> **Mandatory Scope:** ALL Roles (Architect, Implementer, Reviewer) must understand and apply these.

## 1. SOLID Principles (Strict Enforcement)
*   **S - Single Responsibility:** A class/function must have one and only one reason to change.
    *   *Violation:* A `UserService` that handles DB queries AND sends Emails.
    *   *Fix:* Split into `UserRepository` and `EmailNotificationSTervice`.
*   **O - Open/Closed:** Open for extension, closed for modification. Use Interfaces/Abstract classes.
*   **L - Liskov Substitution:** Subtypes must be substitutable for their base types.
*   **I - Interface Segregation:** Clients should not be forced to depend on interfaces they do not use. Split large interfaces.
*   **D - Dependency Inversion:** Depend on abstractions, not concretions.
    *   *Rule:* Always inject dependencies via Constructor. Never use `new Class()` inside business logic.

## 2. Clean Code Core
*   **DRY (Don't Repeat Yourself):** Logic duplicated > 2 times must be extracted to a function/common.
*   **KISS (Keep It Simple, Stupid):** The simplest solution is usually the best. avoid Over-Engineering.
*   **YAGNI (You Ain't Gonna Need It):** Do not implement features/patterns "just in case" for the future.

## 3. Function/Method Rules
*   **Max Lines:** Ideally < 30 lines.
*   **Max Params:** Ideally < 3 parameters. Use a DTO/Object if more are needed.
*   **No Boolean Flags:** A function like `createUser(isSuperAdmin: boolean)` is bad. Split into `createUser` and `createSuperAdmin`.
