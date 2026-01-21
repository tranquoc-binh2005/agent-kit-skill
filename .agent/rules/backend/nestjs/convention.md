# NestJS Specific Conventions

## 1. Architecture
*   Adhere to **Modular Monolith**.
*   Each Feature is a separate Module (`AuthModule`, `UserModule`).

## 2. DTO (Data Transfer Object)
*   Must use `class-validator` to validate input.
*   File naming: `create-user.dto.ts`.

## 3. Services
*   Business Logic must reside in the Service, not in the Controller.
*   Must define Interfaces for Services to facilitate Mock testing.
