# Coding Conventions

> **Goal:** 10 people coding should look like 1 person writing.

---

## 1. Naming Conventions

> **Core Principle:** Stick to **snake_case** or **camelCase** consistently based on the language standard.
> *   **JavaScript/TypeScript:** camelCase (vars, funcs), PascalCase (Classes, Components), kebab-case (Files).
> *   **Python:** snake_case (vars, funcs, files), PascalCase (Classes).
> *   **Go:** camelCase/PascalCase (vars, funcs, structs), snake_case (files).
> *   **PHP/Laravel:** camelCase (vars, funcs), PascalCase (Classes), snake_case (DB columns, config).

### Detailed Rules

| Category | JS/TS | Python/Go/PHP Legacy | Example |
|---|---|---|---|
| **Files** | `kebab-case` | `snake_case` | `user-profile.ts` vs `user_profile.go` |
| **Classes** | `PascalCase` | `PascalCase` | `UserService`, `PaymentStrategy` |
| **Functions** | `camelCase` | `snake_case` (Python only) | `getUserInfo()` |
| **Variables** | `camelCase` | `variable_name` (Python/SQL) | `isValid`, `apiResult` |

---

## 2. Structural Conventions (Logic, Helpers, Common)

### A. Helpers vs Common vs Utils
*   **Helpers:** Functions specifically supporting a particular Business Logic/Module.
    *   *Naming:* `userHelper.ts`, `price_helper.go`
    *   *Location:* Inside the feature module (e.g., `modules/order/helpers/`).
*   **Common / Shared:** Reusable code across the ENTIRE system (Generic).
    *   *Naming:* `dateUtils.ts`, `string_utils.go`
    *   *Location:* Root `src/common` or `src/shared`.
*   **Logic (Handlers/Services):** Pure Business Logic.
    *   *Naming:* Must end with Service/Handler/UseCase (e.g., `OrderService`, `CreateUserUseCase`).

### B. File Purpose Naming
*   **DTO/Types:** Must include suffix (e.g., `user.dto.ts`, `order_response.go`).
*   **Interfaces:** TypeScript interfaces should NOT have "I" prefix (Use `User`, not `IUser`).


---

## 2. Coding Rules

### A. TypeScript
*   ❌ **No `any`**. Use `unknown` or define specific types.
*   ✅ Define Type/Interface for all Component Props.

### B. React (Example)
*   ✅ Use Functional Components + Hooks.
*   ❌ No Class Components.
*   ✅ Destructure props directly in the function signature.
    ```tsx
    // Correct
    const Card = ({ title, content }: CardProps) => { ... }
    
    // Incorrect
    const Card = (props: CardProps) => { const title = props.title ... }
    ```

### C. Import/Export
*   Prioritize **Absolute Imports** (`@/components/...`) over Relative (`../../components/...`).
*   Prioritize **Named Exports** (`export const Button...`) over `export default`.

---

## 3. Comments & Documentation Standards

> **Principle:** Code is the best documentation. Comments must explain **WHY**, not WHAT.

### A. Commenting Rules
*   ✅ **Zero-Comment Policy:** Do not comment on obvious code (e.g., getters/setters, simple loops).
*   ✅ **Complex Logic Only:** Only comment on algorithms or decisions that are counter-intuitive.
*   ❌ **No Icons/Emojis:** Absolutely NO decorations in comments. Keep it professional and raw text only.
    *   *Bad:* `// 🚀 Fast calculation function`
    *   *Good:* `// Uses binary search for O(log n) complexity.`

### B. Function Documentation (JSDoc / GoDoc / Docstring)
*   **Public API Only:** Only document functions exposed to other modules/packages. Private internal functions do not need detailed docs unless complex.
*   **Concise:** Keep descriptions short (1-2 sentences). Do not restate parameter names if their types explain them enough.
*   **Example:**

```ts
// Bad: Redundant
/**
 * Adds two numbers.
 * @param a First number
 * @param b Second number
 * @returns The sum
 */
const add = (a: number, b: number) => a + b;

// Good: Necessary context only
/**
 * Calculates tax based on local VAT rules (2024 reform).
 */
const calculateTax = (price: number, region: string) => { ... }
```

