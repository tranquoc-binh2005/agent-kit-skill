# Clean Architecture Knowledge Base

> Hướng dẫn áp dụng Clean Architecture cho các dự án.

---

## Tổng Quan

Clean Architecture là kiến trúc phần mềm do Robert C. Martin (Uncle Bob) đề xuất, nhằm tạo ra hệ thống:
- **Independent of Frameworks** - Không phụ thuộc vào framework
- **Testable** - Business logic dễ test
- **Independent of UI** - UI có thể thay đổi mà không ảnh hưởng logic
- **Independent of Database** - Database có thể swap
- **Independent of External Agency** - Business rules không biết về thế giới bên ngoài

---

## The Dependency Rule

> **Source code dependencies must point INWARD only.**

```
                    ┌─────────────────────┐
                    │   Entities          │  ← Innermost (most stable)
                    ├─────────────────────┤
                    │   Use Cases         │
                    ├─────────────────────┤
                    │   Interface Adapters│
                    ├─────────────────────┤
                    │   Frameworks & DB   │  ← Outermost (most volatile)
                    └─────────────────────┘
                    
                    Dependencies point ↑ INWARD
```

---

## Layer Breakdown

### 1. Entities (Domain Layer)
**Chứa:** Core business rules, enterprise-wide logic

```typescript
// entities/user.entity.ts
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly createdAt: Date,
  ) {}
  
  // Business rules
  isEmailVerified(): boolean {
    return this.emailVerifiedAt !== null;
  }
  
  canAccessPremiumFeatures(): boolean {
    return this.subscription?.isActive() ?? false;
  }
}
```

**Rules:**
- ✅ Pure TypeScript/JavaScript (no framework dependencies)
- ✅ Contains validation logic
- ✅ Contains domain methods
- ❌ No HTTP, no Database, no external services

---

### 2. Use Cases (Application Layer)
**Chứa:** Application-specific business rules

```typescript
// use-cases/create-user.use-case.ts
export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
}

export interface CreateUserOutput {
  id: string;
  email: string;
  name: string;
}

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly emailService: IEmailService,
  ) {}
  
  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    // 1. Validate
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new UserAlreadyExistsError(input.email);
    }
    
    // 2. Create entity
    const hashedPassword = await this.hashService.hash(input.password);
    const user = new User({
      email: input.email,
      password: hashedPassword,
      name: input.name,
    });
    
    // 3. Persist
    const savedUser = await this.userRepository.save(user);
    
    // 4. Side effects
    await this.emailService.sendWelcomeEmail(savedUser.email);
    
    // 5. Return output
    return {
      id: savedUser.id,
      email: savedUser.email,
      name: savedUser.name,
    };
  }
}
```

**Rules:**
- ✅ Orchestrate flow of data to/from entities
- ✅ Depend only on abstractions (interfaces)
- ✅ One use case per file
- ❌ No framework dependencies
- ❌ No direct database access

---

### 3. Interface Adapters
**Chứa:** Controllers, Presenters, Gateways

```typescript
// adapters/controllers/user.controller.ts
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
  ) {}
  
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const result = await this.createUserUseCase.execute(dto);
    return UserResponseDto.fromDomain(result);
  }
  
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const result = await this.getUserUseCase.execute({ id });
    return UserResponseDto.fromDomain(result);
  }
}
```

```typescript
// adapters/repositories/user.repository.ts
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}
  
  async findById(id: string): Promise<User | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? UserMapper.toDomain(entity) : null;
  }
  
  async save(user: User): Promise<User> {
    const entity = UserMapper.toEntity(user);
    const saved = await this.repo.save(entity);
    return UserMapper.toDomain(saved);
  }
}
```

---

### 4. Frameworks & Drivers
**Chứa:** Framework configs, database setup, external services

```typescript
// infrastructure/database/typeorm.config.ts
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  // ...
};
```

---

## Project Structure

```
src/
├── domain/
│   ├── entities/
│   │   ├── user.entity.ts
│   │   └── order.entity.ts
│   ├── repositories/           # Repository interfaces
│   │   └── user.repository.interface.ts
│   └── errors/
│       └── domain.errors.ts
├── application/
│   ├── use-cases/
│   │   ├── user/
│   │   │   ├── create-user.use-case.ts
│   │   │   └── get-user.use-case.ts
│   │   └── order/
│   ├── services/               # Service interfaces
│   │   ├── hash.service.interface.ts
│   │   └── email.service.interface.ts
│   └── dto/
│       ├── user.input.ts
│       └── user.output.ts
├── infrastructure/
│   ├── database/
│   │   ├── typeorm.config.ts
│   │   └── entities/           # ORM entities
│   ├── repositories/           # Repository implementations
│   │   └── user.repository.ts
│   └── services/               # Service implementations
│       ├── bcrypt-hash.service.ts
│       └── sendgrid-email.service.ts
├── presentation/
│   ├── controllers/
│   │   └── user.controller.ts
│   ├── dto/                    # API DTOs
│   │   ├── create-user.dto.ts
│   │   └── user-response.dto.ts
│   └── filters/
│       └── exception.filter.ts
└── main.ts
```

---

## Dependency Injection Setup

```typescript
// Module setup (NestJS example)
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    // Use Cases
    CreateUserUseCase,
    GetUserUseCase,
    
    // Repository implementations
    {
      provide: 'IUserRepository',
      useClass: TypeOrmUserRepository,
    },
    
    // Service implementations
    {
      provide: 'IHashService',
      useClass: BcryptHashService,
    },
    {
      provide: 'IEmailService',
      useClass: SendGridEmailService,
    },
  ],
})
export class UserModule {}
```

---

## Testing Strategy

```typescript
// Unit test cho Use Case
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockUserRepo: jest.Mocked<IUserRepository>;
  let mockHashService: jest.Mocked<IHashService>;
  
  beforeEach(() => {
    mockUserRepo = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    };
    mockHashService = {
      hash: jest.fn(),
    };
    
    useCase = new CreateUserUseCase(
      mockUserRepo,
      mockHashService,
      mockEmailService,
    );
  });
  
  it('should create user successfully', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockHashService.hash.mockResolvedValue('hashed_password');
    mockUserRepo.save.mockResolvedValue(expectedUser);
    
    const result = await useCase.execute(input);
    
    expect(result.email).toBe(input.email);
    expect(mockUserRepo.save).toHaveBeenCalled();
  });
});
```

---

## Benefits

| Benefit | Description |
|---------|-------------|
| **Testability** | Business logic test không cần DB, HTTP |
| **Maintainability** | Dễ hiểu, dễ modify từng layer |
| **Flexibility** | Swap database, framework dễ dàng |
| **Independence** | Teams có thể làm việc độc lập trên từng layer |
