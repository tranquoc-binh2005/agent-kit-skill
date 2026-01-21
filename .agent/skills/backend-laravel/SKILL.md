---
name: backend-laravel
description: Laravel PHP backend development conventions. Use when working on Laravel/PHP projects.
---

# Backend Laravel Conventions

This skill provides specific conventions for Laravel backend development.

## When to Use
- Use this skill when working on Laravel projects
- Use this skill when creating new controllers, services, or models
- This skill builds upon `project-standards` skill

## Instructions

### 1. Architecture & Design Pattern

#### Service Layer
Complex Business Logic **MUST** be separated into Service Classes.
- Path: `app/Services/{Name}Service.php`

```php
<?php

declare(strict_types=1);

namespace App\Services;

class UserService
{
    public function __construct(
        private readonly UserRepository $userRepository,
    ) {}

    public function createUser(array $data): User
    {
        // Business logic here
        return $this->userRepository->create($data);
    }
}
```

#### Repository Pattern (Optional)
Use when strict separation of DB query logic is needed.
- Path: `app/Repositories/{Name}Repository.php`

#### Form Request
**MUST** use FormRequest to validate input.

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'unique:users'],
            'password' => ['required', 'min:8'],
        ];
    }
}
```

### 2. Coding Style (PSR-12)

- Strictly adhere to PSR-12.
- Use **Strict Types** at the beginning of new PHP files.

```php
<?php

declare(strict_types=1);
```

#### Naming
- Controller: `UserController` (Singular)
- Model: `User` (Singular)
- Table: `users` (Plural)
- Variable: `$camelCase`
- Migration: `create_users_table`

### 3. Controllers

Controllers should be thin - delegate to Services.

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateUserRequest;
use App\Services\UserService;

class UserController extends Controller
{
    public function __construct(
        private readonly UserService $userService,
    ) {}

    public function store(CreateUserRequest $request)
    {
        $user = $this->userService->createUser($request->validated());
        
        return response()->json([
            'success' => true,
            'data' => new UserResource($user),
        ], 201);
    }
}
```

### 4. Eloquent Best Practices

#### Relationships over Query Builder
Prioritize using Eloquent Relationships instead of manual Query Builder.

```php
// Good
$user->orders()->where('status', 'pending')->get();

// Avoid
DB::table('orders')->where('user_id', $user->id)->where('status', 'pending')->get();
```

#### N+1 Problem
**ALWAYS** Eager Load with `with()`.

```php
// Bad - N+1 problem
$users = User::all();
foreach ($users as $user) {
    echo $user->profile->name; // N additional queries
}

// Good - Eager loading
$users = User::with('profile')->get();
```

### 5. API Resource
Use API Resource to transform data returned as JSON.

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
```

### 6. Testing
- Feature Tests for API endpoints.
- Unit Tests for Services and Repositories.

```php
public function test_user_can_be_created(): void
{
    $response = $this->postJson('/api/users', [
        'email' => 'test@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure(['success', 'data' => ['id', 'email']]);
}
```
