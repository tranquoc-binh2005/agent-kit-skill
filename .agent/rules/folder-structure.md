# Folder Structure Regulations

> **Goal:** Keep the project clean and Scalable.

---

## 1. Organization Model (Choose 1 of 2)

*(User, please remove the unused part and detail the chosen one)*

### Option A: Feature-based (Recommended)
Group by business feature.

```
src/
├── features/
│   ├── auth/              # Authentication Feature
│   │   ├── components/    # Components used only for Auth
│   │   ├── hooks/         # Hooks specific to Auth
│   │   ├── api/           # Auth API calls
│   │   └── index.ts       # Public API of this feature
│   │
│   └── dashboard/
│       ├── components/
│       └── ...
```

### Option B: Layer-based (Classic)
Group by file type.

```
src/
├── components/            # Shared components
├── pages/                 # Routing pages
├── services/              # API services
├── utils/                 # Utilities
├── hooks/                 # Global hooks
```

---

## 2. Detailed Rules

1.  **File index.ts:** Every feature must have an `index.ts` file to export necessary items (Barrel file).
2.  **Shared vs Local:**
    *   If a component is used only in 1 feature -> Put in `features/<name>/components`.
    *   If a component is used in > 2 places -> Move to `src/components/shared`.
3.  **Assets:** Images/Icons of a feature should be in that feature's folder (if the framework allows).

---

## 3. Sample Example

When creating a new "Product" feature, the required structure is:

```bash
features/product/
├── ProductList.tsx
├── ProductDetail.tsx
├── useProduct.ts
├── product.api.ts
├── types.ts
```
