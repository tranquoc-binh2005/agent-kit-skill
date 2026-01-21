# Agent Kit Skill

A powerful CLI tool and collection of AI Agent Skills designed to train AI agents to code professionally with clean architecture, scalable patterns, and consistent conventions across **Cursor**, **Windsurf**, and **Antigravity** IDEs.

---

## Overview

Agent Kit Skill helps you:
- Train AI agents to follow your project's coding standards
- Apply Clean Architecture, SOLID principles, and best practices
- Use Focus Modes for deep specialization (Backend, Frontend, Debug, etc.)
- Maintain consistency across team members and projects

---

## Features

| Feature | Description |
|---------|-------------|
| **Multi-IDE Support** | Cursor, Windsurf, Antigravity with native configurations |
| **Smart Skills** | 12 specialized skills for Frontend, Backend, DevOps |
| **Focus Modes** | Deep specialization with `/backend`, `/frontend`, `/debug`, etc. |
| **Role-Based Agents** | Architect, Reviewer, Debugger, Implementer modes |
| **Multi-Language** | English and Vietnamese support |
| **Template Prompts** | Ready-to-use prompt examples in config file |

---

## Installation

### Option 1: NPX (Recommended)

```bash
npx octotech-agent-kit init
```

### Option 2: Global Install

```bash
npm install -g octotech-agent-kit
agent-kit init
```

### Option 3: From Source

```bash
git clone https://github.com/octotech/agent-kit-skill.git
cd agent-kit-skill/cli
npm install
npm link
agent-kit init
```

---

## Quick Start

### 1. Initialize Project

Navigate to your project root and run:

```bash
agent-kit init
```

### 2. Answer Questions

```
? Select language: English / Tieng Viet
? Which IDE are you using? Cursor / Windsurf / Antigravity
? What type of project? Backend / Frontend / Fullstack / Mobile / DevOps
? Select your Tech Stack: NestJS / Laravel / Go / Next.js / Vue / Flutter...
? Select your Database: PostgreSQL / MySQL / MongoDB / SQLite
? Select AI Agent roles: Implementer, Architect, Reviewer, Debugger
```

### 3. Start Using

After setup, use AI with focus modes:

```
/backend Create CRUD API for User entity with DTO validation
/frontend Create responsive dashboard component
/debug Analyze error: Cannot read property of undefined
/reviewer Review code and check security issues
/architect Design microservices architecture for payment system
```

---

## Generated Files

### For Cursor IDE

```
project/
├── .cursorrules              # Entry file with rules summary
├── .cursor/
│   ├── rules/                # Domain rules (frontend, backend, devops...)
│   ├── skills/               # 12 skill folders
│   ├── workflows/            # Focus mode definitions
│   └── knowledge/            # Design patterns, clean architecture
└── agent-kit-skill.json      # Configuration file
```

### For Windsurf IDE

```
project/
├── AGENTS.md                 # Entry file for Cascade
├── .windsurf/
│   ├── rules/
│   ├── skills/
│   ├── workflows/
│   └── knowledge/
└── agent-kit-skill.json
```

### For Antigravity IDE

```
project/
├── GEMINI.md                 # Entry file for Gemini
├── .agent/
│   ├── rules/
│   ├── skills/
│   ├── workflows/
│   └── knowledge/
└── agent-kit-skill.json
```

---

## Configuration

### agent-kit-skill.json

```json
{
  "version": "1.0.0",
  "ide": "cursor",
  "language": "vi",
  "projectType": "backend",
  "techStack": "nestjs",
  "database": "postgresql",
  "roles": ["implementer", "architect", "reviewer", "debugger"],
  "focusModes": {
    "enabled": true,
    "default": "backend"
  },
  "templatePrompts": {
    "backend": ["/backend Create CRUD API for [entity]..."],
    "frontend": ["/frontend Create component [name]..."],
    "debug": ["/debug Analyze error: [message]..."]
  }
}
```

### Update Configuration

After editing `agent-kit-skill.json`, run:

```bash
agent-kit update
```

---

## Focus Modes

| Mode | Trigger | Purpose |
|------|---------|---------|
| Backend | `/backend` | API development, database design, business logic |
| Frontend | `/frontend` | UI/UX, components, state management |
| DevOps | `/devops` | Docker, CI/CD, infrastructure |
| Fullstack | `/fullstack` | End-to-end development |
| Mobile | `/mobile` | Flutter, React Native, SwiftUI, Android |
| Debug | `/debug` | Bug analysis, root cause finding |
| Reviewer | `/reviewer` | Code review, security check |
| Architect | `/architect` | System design, architecture decisions |

### Example Usage

```
# Backend focus
/backend Design database schema for e-commerce with users, products, orders

# Debug focus
/debug API returns 500 error when creating user with duplicate email

# Architect focus  
/architect Compare monolith vs microservices for our 10-developer team
```

---

## Available Skills

### Core
- `project-standards` - SOLID, Clean Code, naming conventions (always applies)

### Backend
- `backend-nestjs` - NestJS/TypeScript conventions
- `backend-laravel` - Laravel/PHP conventions
- `backend-go` - Go/Golang conventions

### Frontend
- `frontend-nextjs` - Next.js/React conventions
- `frontend-vue` - Vue 3/Nuxt 3 conventions

### DevOps
- `devops-docker` - Docker containerization
- `devops-cicd` - CI/CD pipelines (GitHub Actions, GitLab CI)

### Roles
- `role-architect` - System design mode
- `role-reviewer` - Code review mode
- `role-debugger` - Bug fixing mode
- `role-implementer` - Implementation mode

---

## Domain Rules

### Frontend Rules
- CSS Variables for colors (no hardcoding)
- Mobile-first responsive design
- Skeleton loading over spinners
- Limited global state (auth, theme, i18n only)
- Lazy loading and code splitting
- Accessibility standards (a11y)

### Backend Rules
- RESTful API standards
- Consistent response format: `{ success, data, meta, error, timestamp }`
- Clean Architecture layers (Controller, Service, Repository)
- Input validation with DTOs
- Proper error codes and HTTP status

### DevOps Rules
- Multi-stage Docker builds
- Non-root container users
- Health check endpoints required
- Structured JSON logging
- Infrastructure as Code

---

## Knowledge Base

The kit includes reference documentation:

- **design-patterns.md** - Singleton, Factory, Repository, Strategy, Observer
- **clean-architecture.md** - Layers, Dependency Rule, SOLID in practice

---

## Template Prompts

The config file includes ready-to-use prompts. Example (Vietnamese):

```json
"templatePrompts": {
  "backend": [
    "/backend Tao CRUD API cho entity [ten entity] voi DTO validation",
    "/backend Thiet ke database schema cho tinh nang [ten feature]"
  ],
  "debug": [
    "/debug Phan tich loi: [paste error message]",
    "/debug Tim nguyen nhan loi 'Cannot read property of undefined'"
  ]
}
```

Copy, modify `[placeholders]`, and paste to AI chat.

---

## CLI Commands

| Command | Description |
|---------|-------------|
| `agent-kit init` | Initialize new project with wizard |
| `agent-kit update` | Reload configuration after editing JSON |
| `agent-kit --help` | Show help |
| `agent-kit --version` | Show version |

---

## Project Structure

```
agent-kit-skill/
├── cli/
│   ├── src/
│   │   └── index.js          # CLI entry point
│   ├── templates/
│   │   ├── rules/            # Domain rules (FE, BE, DevOps, Mobile)
│   │   ├── skills/           # 12 skill definitions
│   │   ├── workflows/        # Focus mode definitions
│   │   └── knowledge/        # Design patterns, architecture
│   └── package.json
├── .cursor/                  # Cursor IDE config (example)
├── .windsurf/                # Windsurf IDE config (example)
├── .agent/                   # Antigravity IDE config (example)
├── AGENTS.md                 # Windsurf entry file
├── GEMINI.md                 # Antigravity entry file
└── README.md
```

---

## Principles Enforced

The AI agent will follow these principles:

- **SOLID** - Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion
- **Clean Code** - DRY, KISS, YAGNI
- **No `any` in TypeScript**
- **No Icons/Emojis in code comments**
- **Comments explain WHY, not WHAT**

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

ISC License

---

## Support

- Issues: [GitHub Issues](https://github.com/octotech/agent-kit-skill/issues)
- Documentation: See `.agent/rules/` for detailed conventions
