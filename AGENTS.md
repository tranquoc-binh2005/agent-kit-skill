# Windsurf Project Instructions (Global)

> These instructions apply to the ENTIRE workspace.

---

## Core Principles

- Follow **SOLID** principles strictly.
- **DRY** (Don't Repeat Yourself) and **KISS** (Keep It Simple).
- **No `any`** in TypeScript.
- **No Icons/Emojis** in code comments.

---

## Available Skills

Windsurf Cascade can perform complex tasks using these skills (Auto-invoked or via `@`):

### Core
- `@project-standards` - Core conventions (Use always)

### Backend
- `@backend-nestjs` - For NestJS tasks
- `@backend-laravel` - For Laravel tasks
- `@backend-go` - For Go tasks

### Frontend
- `@frontend-nextjs` - For Next.js tasks
- `@frontend-vue` - For Vue/Nuxt tasks

### DevOps
- `@devops-docker` - For Docker tasks
- `@devops-cicd` - For CI/CD pipelines

### Roles
- `@role-architect` - For system design
- `@role-reviewer` - For code review
- `@role-debugger` - For bug fixing
- `@role-implementer` - For implementation

---

## Focus Modes

Use these triggers for deep focus:
- `/backend` - API and database development
- `/frontend` - UI/UX development
- `/devops` - Infrastructure and deployment
- `/debug` - Bug fixing mode
- `/reviewer` - Code review mode
- `/architect` - System design mode

---

## Rules Location

Domain-specific rules are in `.windsurf/rules/`:
- `frontend/general.md` - Frontend conventions
- `backend/general.md` - Backend conventions
- `devops/general.md` - DevOps standards
- `fullstack/general.md` - Fullstack patterns
- `mobile/general.md` - Mobile development

---

## Knowledge Base

Reference documentation in `.windsurf/knowledge/`:
- `design-patterns.md` - Common design patterns
- `clean-architecture.md` - Clean Architecture guide

---

## Directory-Scoped Rules

Windsurf automatically looks for `AGENTS.md` in subdirectories.
- If working in `/src/backend`, create an `AGENTS.md` there with specific backend rules.
- If working in `/src/frontend`, create an `AGENTS.md` there.

---

## Role Modes

To switch modes, tell Cascade:
- "Act as Architect" -> triggers `@role-architect`
- "Review this code" -> triggers `@role-reviewer`
- "Fix this bug" -> triggers `@role-debugger`
