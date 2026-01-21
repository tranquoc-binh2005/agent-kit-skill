---
name: frontend-angular
description: Angular (v17+) frontend development conventions. Use when working on Angular projects.
---

# Frontend Angular (v17+) Conventions

This skill provides specific conventions for Angular 17+ development using Modern Angular features.

## When to Use
- Use this skill when working on Angular projects
- Use this skill when creating new components, services, or directives
- This skill builds upon `project-standards` skill

## Instructions

### 1. Modern Angular (Standalone)

#### Component Structure
Always use `standalone: true`. Avoid NgModules unless integrating legacy libraries.

```typescript
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile">
      <h1>{{ name() }}</h1>
      <button (click)="updateName()">Update</button>
    </div>
  `,
  styles: [`
    .profile { padding: 1rem; }
  `]
})
export class UserProfileComponent {
  name = signal('John Doe');

  updateName() {
    this.name.set('Jane Doe');
  }
}
```

### 2. Reactivity with Signals

Use `signal`, `computed`, and `effect` instead of RxJS for synchronous state.

```typescript
import { Component, signal, computed } from '@angular/core';

@Component({ ... })
export class CounterComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);

  increment() {
    this.count.update(n => n + 1);
  }
}
```

### 3. Control Flow Syntax

Use the new built-in control flow (`@if`, `@for`, `@switch`).

```html
@if (isLoggedIn()) {
  <user-dashboard />
} @else {
  <login-form />
}

<ul>
  @for (user of users(); track user.id) {
    <li>{{ user.name }}</li>
  } @empty {
    <li>No users found.</li>
  }
</ul>
```

### 4. Dependency Injection

Use `inject()` function instead of constructor injection.

```typescript
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({ ... })
export class DataComponent {
  private http = inject(HttpClient);
  
  data$ = this.http.get('/api/data');
}
```

### 5. Smart vs Dumb Components

- **Smart Components** (aka Pages/Containers): Handle data calls (`inject` services), manage state, pass data down.
- **Dumb Components** (aka UI): Receive `@Input`, emit `@Output`, no side effects.

### 6. Inputs and Outputs

Use `input()` (Signal Inputs) and `output()`.

```typescript
import { Component, input, output } from '@angular/core';

@Component({ ... })
export class ChildComponent {
  // Signal Input (Read-only signal)
  title = input.required<string>(); // required
  count = input(0); // optional with default

  // Output
  changed = output<number>();

  emitChange() {
    this.changed.emit(10);
  }
}
```

### 7. State Management

For most apps, use **Services with Signals**.

```typescript
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<Item[]>([]);

  readonly cartItems = this.items.asReadonly();

  addItem(item: Item) {
    this.items.update(current => [...current, item]);
  }
}
```

### 8. Project Structure

```
src/
  app/
    core/           # Singleton services, interceptors, guards
    shared/         # Reusable UI components, pipes, directives
    features/       # Feature modules/folders (e.g., users, products)
      users/
        users.routes.ts
        user-list/
        user-detail/
    app.routes.ts
    app.config.ts
    app.component.ts
```

### 9. Dependencies

- **Styling:** Tailwind CSS or SCSS
- **State:** NgRx Signal Store or Service + Signals
- **Validation:** Reactive Forms
- **UI:** Angular Material or PrimeNG
