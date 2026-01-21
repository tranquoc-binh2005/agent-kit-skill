# Design Patterns Knowledge Base

> Tài liệu tham khảo các Design Patterns phổ biến cho AI Agent.

---

## Creational Patterns

### Singleton
**Mục đích:** Đảm bảo một class chỉ có một instance.

**Khi dùng:**
- Database connection pool
- Logger instance
- Configuration manager

```typescript
class ConfigService {
  private static instance: ConfigService;
  
  private constructor() {}
  
  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }
}
```

### Factory
**Mục đích:** Tạo objects mà không expose logic tạo ra client.

**Khi dùng:**
- Khi tạo objects phức tạp
- Khi cần switch implementation dựa trên điều kiện

```typescript
interface PaymentProcessor {
  process(amount: number): void;
}

class PaymentFactory {
  static create(type: 'stripe' | 'paypal'): PaymentProcessor {
    switch (type) {
      case 'stripe':
        return new StripeProcessor();
      case 'paypal':
        return new PaypalProcessor();
    }
  }
}
```

### Builder
**Mục đích:** Xây dựng complex objects step by step.

**Khi dùng:**
- Objects có nhiều optional parameters
- Khi cần validate trước khi tạo object

```typescript
class QueryBuilder {
  private query: Query = {};
  
  select(fields: string[]): this {
    this.query.select = fields;
    return this;
  }
  
  where(condition: object): this {
    this.query.where = condition;
    return this;
  }
  
  orderBy(field: string): this {
    this.query.orderBy = field;
    return this;
  }
  
  build(): Query {
    return this.query;
  }
}

// Usage
const query = new QueryBuilder()
  .select(['id', 'name'])
  .where({ active: true })
  .orderBy('createdAt')
  .build();
```

---

## Structural Patterns

### Repository
**Mục đích:** Abstraction layer cho data access.

**Khi dùng:**
- Tách biệt business logic khỏi data access
- Dễ dàng mock trong testing

```typescript
interface UserRepository {
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}

class PostgresUserRepository implements UserRepository {
  constructor(private db: Database) {}
  
  async findById(id: string): Promise<User | null> {
    return this.db.users.findUnique({ where: { id } });
  }
  // ... other methods
}
```

### Adapter
**Mục đích:** Cho phép interface incompatible làm việc cùng nhau.

**Khi dùng:**
- Tích hợp third-party libraries
- Legacy code integration

```typescript
// Third-party library có interface khác
class OldPaymentGateway {
  makePayment(dollars: number, cents: number): boolean { ... }
}

// Adapter để match với interface của chúng ta
class PaymentAdapter implements PaymentProcessor {
  constructor(private gateway: OldPaymentGateway) {}
  
  process(amount: number): void {
    const dollars = Math.floor(amount);
    const cents = Math.round((amount - dollars) * 100);
    this.gateway.makePayment(dollars, cents);
  }
}
```

### Decorator
**Mục đích:** Thêm behavior dynamically vào object.

**Khi dùng:**
- Logging, caching, validation wrappers
- Khi không muốn modify original class

```typescript
// TypeScript decorator
function Log() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      console.log(`Calling ${key} with`, args);
      const result = await original.apply(this, args);
      console.log(`${key} returned`, result);
      return result;
    };
  };
}

class UserService {
  @Log()
  async findById(id: string): Promise<User> {
    // ...
  }
}
```

---

## Behavioral Patterns

### Strategy
**Mục đích:** Define family of algorithms, encapsulate each one.

**Khi dùng:**
- Khi có nhiều cách thực hiện cùng một action
- Khi muốn switch algorithm at runtime

```typescript
interface PricingStrategy {
  calculate(basePrice: number): number;
}

class RegularPricing implements PricingStrategy {
  calculate(basePrice: number): number {
    return basePrice;
  }
}

class PremiumPricing implements PricingStrategy {
  calculate(basePrice: number): number {
    return basePrice * 0.8; // 20% discount
  }
}

class PricingService {
  constructor(private strategy: PricingStrategy) {}
  
  getPrice(basePrice: number): number {
    return this.strategy.calculate(basePrice);
  }
  
  setStrategy(strategy: PricingStrategy): void {
    this.strategy = strategy;
  }
}
```

### Observer
**Mục đích:** Notify multiple objects khi state thay đổi.

**Khi dùng:**
- Event-driven systems
- Real-time updates
- Pub/Sub patterns

```typescript
interface Observer {
  update(data: any): void;
}

class EventEmitter {
  private observers: Map<string, Observer[]> = new Map();
  
  subscribe(event: string, observer: Observer): void {
    if (!this.observers.has(event)) {
      this.observers.set(event, []);
    }
    this.observers.get(event)!.push(observer);
  }
  
  emit(event: string, data: any): void {
    this.observers.get(event)?.forEach(obs => obs.update(data));
  }
}
```

---

## Architectural Patterns

### Clean Architecture Layers

```
┌─────────────────────────────────────────┐
│         Frameworks & Drivers            │  Express, TypeORM, etc.
├─────────────────────────────────────────┤
│         Interface Adapters              │  Controllers, Presenters
├─────────────────────────────────────────┤
│         Application Business Rules      │  Use Cases
├─────────────────────────────────────────┤
│         Enterprise Business Rules       │  Entities
└─────────────────────────────────────────┘

Dependencies point INWARD only!
```

### CQRS (Command Query Responsibility Segregation)

```
┌─────────────┐     ┌─────────────┐
│   Commands  │     │   Queries   │
│  (Write)    │     │   (Read)    │
└──────┬──────┘     └──────┬──────┘
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│ Write Model │     │ Read Model  │
│ (Normalized)│     │(Denormalized)│
└─────────────┘     └─────────────┘
```

**Khi dùng CQRS:**
- High-read, low-write workloads
- Complex queries requirements
- Event sourcing systems

---

## Anti-Patterns to Avoid

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| **God Class** | Class làm quá nhiều việc | Single Responsibility |
| **Spaghetti Code** | Code không structure | Proper layering |
| **Copy-Paste** | Duplicate code | Extract to functions |
| **Magic Numbers** | Hardcoded values | Use constants |
| **Premature Optimization** | Optimize too early | Measure first |
