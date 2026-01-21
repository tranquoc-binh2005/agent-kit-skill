---
name: backend-nestjs
description: NestJS backend development conventions. Use when working on NestJS/Node.js TypeScript backend projects.
---

# Backend NestJS Conventions

This skill provides specific conventions for NestJS backend development.

## When to Use
- Use this skill when working on NestJS projects
- Use this skill when creating new NestJS modules, services, or controllers
- This skill builds upon `project-standards` skill

## Instructions

### 1. Architecture
- Adhere to **Modular Monolith** architecture.
- Each Feature is a separate Module (`AuthModule`, `UserModule`).

### 2. Module Structure
```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   └── guards/
│   │       └── jwt.guard.ts
```

### 3. DTO (Data Transfer Object)
- **MUST** use `class-validator` to validate input.
- File naming: `create-user.dto.ts`, `update-user.dto.ts`.

```typescript
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

### 4. Services
- Business Logic **MUST** reside in the Service, not in the Controller.
- Define Interfaces for Services to facilitate Mock testing.

```typescript
// user.service.interface.ts
export interface IUserService {
  findById(id: string): Promise<User>;
  create(dto: CreateUserDto): Promise<User>;
}

// user.service.ts
@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
}
```

### 5. Controllers
- Controllers should be thin - only handle HTTP concerns.
- Use appropriate decorators for routes.

```typescript
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto);
  }
}
```

### 6. Exception Handling
- Use NestJS built-in exceptions (`NotFoundException`, `BadRequestException`).
- Create custom exceptions for domain-specific errors.

```typescript
throw new NotFoundException(`User with ID ${id} not found`);
throw new BadRequestException('Invalid email format');
```

### 7. Dependency Injection
- Always use constructor injection.
- Register providers in the module's `providers` array.

### 8. Configuration
- Use `@nestjs/config` for environment variables.
- Never hardcode secrets or URLs.

### 9. Testing
- Unit tests for Services (mock repositories).
- E2E tests for Controllers (test HTTP layer).
