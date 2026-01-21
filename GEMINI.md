# Antigravity Project Instructions

> Global instructions for Antigravity IDE Agent.

---

## Core Principles

- Follow **SOLID** principles strictly.
- **DRY** (Don't Repeat Yourself) and **KISS** (Keep It Simple).
- **No `any`** in TypeScript.
- **No Icons/Emojis** in code comments.
- Read `agent-kit-skill.json` for project context.

---

## Available Skills

Skills are in `.agent/skills/`:

### Core
- `project-standards` - Core conventions (Always applies)

### Backend
- `backend-nestjs` - NestJS development
- `backend-laravel` - Laravel development
- `backend-go` - Go development

### Frontend
- `frontend-nextjs` - Next.js development
- `frontend-vue` - Vue/Nuxt development

### DevOps
- `devops-docker` - Docker containerization
- `devops-cicd` - CI/CD pipelines

### Roles
- `role-architect` - System design mode
- `role-reviewer` - Code review mode
- `role-debugger` - Bug fixing mode
- `role-implementer` - Implementation mode

---

## Focus Modes

Use these workflow triggers for deep focus:
- `/backend` - API and database development
- `/frontend` - UI/UX development
- `/devops` - Infrastructure and deployment
- `/debug` - Bug fixing mode
- `/reviewer` - Code review mode
- `/architect` - System design mode

Workflows are in `.agent/workflows/`.

---

## Rules Location

Domain-specific rules are in `.agent/rules/`:

### By Domain
- `frontend/general.md` - Frontend conventions
- `backend/general.md` - Backend conventions
- `devops/general.md` - DevOps standards
- `fullstack/general.md` - Fullstack patterns
- `mobile/general.md` - Mobile development

### By Technology
- `backend/nestjs/convention.md` - NestJS specific
- `backend/laravel/convention.md` - Laravel specific
- `backend/go/convention.md` - Go specific
- `frontend/nextjs/convention.md` - Next.js specific
- `frontend/vue/convention.md` - Vue specific

### By Role
- `roles/architect.md` - Architect behavior
- `roles/reviewer.md` - Reviewer behavior
- `roles/debugger.md` - Debugger behavior
- `roles/implementer.md` - Implementer behavior

---

## Knowledge Base

Reference documentation in `.agent/knowledge/`:
- `design-patterns.md` - Common design patterns
- `clean-architecture.md` - Clean Architecture guide

---

## Configuration

Check `agent-kit-skill.json` in project root for:
- Selected IDE
- Preferred language (en/vi)
- Project type
- Tech stack
- Database
- Active roles
- Focus mode settings

---

## Response Language

Read `agent-kit-skill.json` to determine response language:
- If `"language": "vi"` - Respond in Vietnamese
- If `"language": "en"` - Respond in English

**MUST follow this strictly.**
