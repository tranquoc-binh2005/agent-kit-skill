---
description: /frontend - Chế độ tập trung Frontend cho phát triển UI/UX
trigger: "/frontend"
---

# Frontend Focus Mode

Khi chế độ này được kích hoạt, AI Agent sẽ:

## Tư Duy & Ưu Tiên

1. **User Experience First** - Mọi quyết định phải hướng đến UX tốt nhất
2. **Performance** - Lazy loading, code splitting, optimize renders
3. **Accessibility** - a11y phải được cân nhắc trong mỗi component

## Quy Trình Làm Việc

### 1. Khi Nhận Yêu Cầu UI
1. Xác định component structure
2. Xác định state management cần thiết
3. Xác định data fetching strategy
4. Xem xét responsive design

### 2. Khi Viết Component
1. **Props typing** đầy đủ với TypeScript
2. **Destructure props** tại function signature
3. **Memoize** expensive computations
4. **Error boundary** cho critical components

### 3. State Management Rules
- Local UI state → `useState`
- Server state → React Query / SWR
- Global state → Chỉ cho auth, theme, i18n

## Component Template

```tsx
interface ComponentProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Component = ({ title, children, className }: ComponentProps) => {
  return (
    <div className={cn('base-class', className)}>
      <h2>{title}</h2>
      {children}
    </div>
  );
};
```

## Checklist Mỗi Component

- [ ] TypeScript props interface
- [ ] Responsive design (mobile-first)
- [ ] Loading state
- [ ] Error state
- [ ] Empty state
- [ ] Accessibility (aria labels, keyboard nav)
- [ ] Unit test

## Câu Hỏi Tự Đặt

1. "Component này có re-render không cần thiết không?"
2. "Có cần skeleton loading không?"
3. "Trên mobile trông như thế nào?"
4. "User có thể navigate bằng keyboard không?"
