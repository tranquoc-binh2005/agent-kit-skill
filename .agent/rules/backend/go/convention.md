# Go (Golang) Specific Conventions

## 1. Project Layout (Standard Go Layout)
*   `/cmd`: Application entry point (main.go).
*   `/internal`: Private code, not shared externally (Business Logic, Models).
*   `/pkg`: Library code that can be shared (Utils, Helpers).
*   `/api`: OpenAPI/Swagger definitions.

## 2. Architecture (Clean/Hexagonal)
*   **Handler (Controller):** Receives requests, validates, calls Service.
*   **Service (Usecase):** Contains Business Logic.
*   **Repository:** Interacts with the Database.
*   *Note:* Interfaces should be defined where they are USED (Consumer), not where they are provided (Producer).

## 3. Error Handling
*   **No Panic:** Only panic during app setup failure (e.g., db disconnect).
*   **Return Error:** Always return error as the last argument.
*   **Wrap Error:** Use `fmt.Errorf("action failed: %w", err)` to preserve the context stack trace.

## 4. Naming Convention
*   **Package:** Short, lowercase, no underscores (e.g., `user`, `auth`).
*   **Interface:** Ends with `er` (e.g., `Repository` -> `Reader`, `Writer` or `UserRepository`).
*   **Variable:** camelCase (`userID`), acronyms all uppercase (`userID` -> `userID` or `HTTP` -> `httpClient`, NOT `http_client`).
