# Mobile Development General Rules

> **Goal:** Build performant, accessible, and maintainable mobile applications.

---

## 1. Architecture Patterns

### Clean Architecture Layers
```
┌─────────────────────────────────────────┐
│           Presentation Layer            │  UI, ViewModels, Controllers
├─────────────────────────────────────────┤
│            Domain Layer                 │  Use Cases, Entities, Repository Interfaces
├─────────────────────────────────────────┤
│             Data Layer                  │  Repository Impl, Data Sources, DTOs
└─────────────────────────────────────────┘
```

### State Management by Platform
| Platform | Recommended | Alternative |
|----------|-------------|-------------|
| **Flutter** | Riverpod, BLoC | Provider, GetX |
| **React Native** | Redux Toolkit, Zustand | MobX, Jotai |
| **SwiftUI** | @StateObject, @ObservedObject | Combine |
| **Android** | ViewModel + StateFlow | LiveData |

---

## 2. Project Structure

### Feature-Based Structure (Cross-Platform)
```
lib/  (or src/)
├── core/
│   ├── constants/
│   ├── errors/
│   ├── network/
│   │   ├── api_client.dart
│   │   └── interceptors/
│   ├── storage/
│   └── utils/
├── features/
│   ├── auth/
│   │   ├── data/
│   │   │   ├── datasources/
│   │   │   ├── models/
│   │   │   └── repositories/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   │   └── usecases/
│   │   └── presentation/
│   │       ├── screens/
│   │       ├── widgets/
│   │       └── controllers/
│   └── home/
├── shared/
│   ├── widgets/
│   └── themes/
└── main.dart
```

---

## 3. Performance Optimization

### Essential Optimizations
| Technique | Purpose | When to Use |
|-----------|---------|-------------|
| **Lazy Loading** | Reduce initial load | Always for routes/screens |
| **Image Caching** | Reduce network calls | All remote images |
| **List Virtualization** | Memory efficiency | Lists > 20 items |
| **Pagination** | Control data loading | API lists |
| **Memoization** | Prevent rebuilds | Expensive computations |

### Image Best Practices
- ✅ Use **cached_network_image** (Flutter) or **FastImage** (RN)
- ✅ Compress images before upload
- ✅ Use appropriate image sizes (thumbnails vs full)
- ✅ Support for WebP format
- ❌ Never load full-size images for thumbnails

### List Performance
```dart
// Flutter: Use ListView.builder for long lists
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => ItemWidget(item: items[index]),
);

// NOT this for long lists:
ListView(
  children: items.map((item) => ItemWidget(item: item)).toList(),
);
```

---

## 4. Offline-First Strategy

### Data Flow
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│    UI    │ ←── │  Cache   │ ←── │   API    │
└──────────┘     └──────────┘     └──────────┘
                      │
                      ↓
              ┌──────────────┐
              │  Local DB    │
              │ (SQLite/     │
              │  Hive/Realm) │
              └──────────────┘
```

### Implementation Pattern
```dart
// Repository pattern with offline support
class UserRepository {
  final ApiClient _api;
  final LocalDatabase _db;
  
  Future<List<User>> getUsers() async {
    try {
      // Try network first
      final users = await _api.getUsers();
      // Cache for offline
      await _db.cacheUsers(users);
      return users;
    } catch (e) {
      // Fallback to cache
      return _db.getCachedUsers();
    }
  }
}
```

---

## 5. Navigation Patterns

### Navigation Structure
```
App
├── Auth Flow (Stack)
│   ├── Login
│   ├── Register
│   └── Forgot Password
└── Main Flow (Tab/Drawer)
    ├── Home (Stack)
    │   ├── Home List
    │   └── Detail
    ├── Search
    ├── Profile (Stack)
    │   ├── Profile View
    │   └── Edit Profile
    └── Settings
```

### Deep Linking
- ✅ Support universal links (iOS) / app links (Android)
- ✅ Handle all navigation via route names
- ✅ Preserve state on back navigation
- ❌ Never hardcode screen navigation in widgets

---

## 6. UI/UX Standards

### Platform Guidelines
| Platform | Design System | Must Follow |
|----------|--------------|-------------|
| **iOS** | Human Interface Guidelines | ✅ |
| **Android** | Material Design | ✅ |
| **Cross-Platform** | Custom + Platform-specific | ✅ |

### Responsive Design
```dart
// Flutter responsive breakpoints
class Breakpoints {
  static const double mobile = 600;
  static const double tablet = 900;
  static const double desktop = 1200;
}

// Usage
Widget build(BuildContext context) {
  final width = MediaQuery.of(context).size.width;
  
  if (width < Breakpoints.mobile) {
    return MobileLayout();
  } else if (width < Breakpoints.tablet) {
    return TabletLayout();
  } else {
    return DesktopLayout();
  }
}
```

### Touch Targets
- ✅ Minimum touch target: **44x44 points** (iOS) / **48x48 dp** (Android)
- ✅ Adequate spacing between interactive elements
- ✅ Visual feedback on touch (ripple, highlight)

---

## 7. Accessibility

### Requirements
- ✅ **Semantic labels** for all interactive elements
- ✅ **Sufficient color contrast** (4.5:1 minimum)
- ✅ **Screen reader support** (VoiceOver, TalkBack)
- ✅ **Dynamic type support** (text scaling)
- ✅ **Reduce motion** option respect

### Implementation
```dart
// Flutter accessibility
Semantics(
  label: 'Add item to cart',
  button: true,
  child: IconButton(
    icon: Icon(Icons.add_shopping_cart),
    onPressed: () => addToCart(),
  ),
);

// Exclude decorative elements
ExcludeSemantics(
  child: Image.asset('decorative_image.png'),
);
```

---

## 8. Error Handling

### Error Types
```dart
// Base error classes
abstract class AppException implements Exception {
  String get message;
  String get code;
}

class NetworkException extends AppException {
  @override
  final String message = 'No internet connection';
  @override
  final String code = 'NETWORK_ERROR';
}

class ServerException extends AppException {
  @override
  final String message;
  @override
  final String code;
  
  ServerException({required this.message, required this.code});
}
```

### Error Display Strategy
| Error Type | UI Response |
|------------|-------------|
| **Network** | Retry button + offline mode |
| **Validation** | Inline field errors |
| **Server** | Toast/Snackbar message |
| **Critical** | Full error screen |

---

## 9. Security

### Secure Storage
| Data Type | Storage Method |
|-----------|---------------|
| **Auth tokens** | Keychain (iOS) / EncryptedSharedPreferences (Android) |
| **User preferences** | SharedPreferences (non-sensitive) |
| **Cached data** | Encrypted SQLite |

### Security Checklist
- ✅ Certificate pinning for API calls
- ✅ Biometric authentication option
- ✅ Auto-logout on inactivity
- ✅ Obfuscate release builds
- ❌ Never log sensitive data
- ❌ Never store passwords locally

---

## 10. Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| **Files** | snake_case | `user_profile_screen.dart` |
| **Classes** | PascalCase | `UserProfileScreen` |
| **Functions** | camelCase | `getUserProfile()` |
| **Variables** | camelCase | `isLoading` |
| **Constants** | SCREAMING_SNAKE | `API_BASE_URL` |
| **Directories** | snake_case | `user_profile/` |

---

## 11. Testing Strategy

### Test Pyramid
```
         ┌───────────┐
         │   E2E     │  10%
         ├───────────┤
         │Integration│  20%
         ├───────────┤
         │   Unit    │  70%
         └───────────┘
```

### What to Test
| Layer | Test Type | Coverage Target |
|-------|-----------|-----------------|
| **Use Cases** | Unit | 90%+ |
| **Repositories** | Unit + Mock | 80%+ |
| **ViewModels** | Unit | 80%+ |
| **Widgets** | Widget/Integration | 60%+ |
| **Critical Flows** | E2E | Key paths |
