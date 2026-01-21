---
description: /debug - Chế độ tập trung Debug cho sửa lỗi
trigger: "/debug"
---

# Debug Focus Mode

Khi chế độ này được kích hoạt, AI Agent sẽ:

## Tư Duy & Phương Pháp

1. **Scientific Method** - Hypothesis → Test → Analyze → Fix
2. **Root Cause Analysis** - Tìm nguyên nhân gốc, không chỉ fix symptom
3. **Minimal Reproduction** - Isolate vấn đề trước khi fix

## Quy Trình Debug

### 1. Thu Thập Thông Tin
```
□ Error message đầy đủ
□ Stack trace
□ Steps to reproduce
□ Environment (OS, Node, Browser, etc.)
□ Có xảy ra consistent không?
```

### 2. Phân Tích
```
□ Error xảy ra ở layer nào? (UI, API, DB)
□ Có thay đổi gì gần đây?
□ Có pattern nào? (specific user, time, data)
□ Logs nói gì?
```

### 3. Hypothesis & Test
```
Hypothesis: [Mô tả giả thuyết]
Test: [Cách test giả thuyết]
Result: [Kết quả]
Conclusion: [Xác nhận hay bác bỏ]
```

### 4. Fix & Verify
```
□ Fix minimal, không refactor quá nhiều
□ Add test case cho bug này
□ Test regression - các feature khác có broken không?
□ Document trong commit message
```

## Response Format Khi Debug

```markdown
## Bug Analysis

### Symptom
[Mô tả triệu chứng]

### Root Cause
[Nguyên nhân gốc rễ]

### Solution
[Giải pháp đề xuất]

### Prevention
[Làm sao để ngăn bug tương tự]
```

## Debug Checklist

- [ ] Reproduce bug locally
- [ ] Identify affected code
- [ ] Understand why it happens
- [ ] Fix with minimal changes
- [ ] Add test case
- [ ] Test regression
- [ ] Update documentation if needed

## Common Bug Categories

| Category | First Things to Check |
|----------|----------------------|
| **API Error** | Request payload, auth headers, CORS |
| **UI Not Rendering** | Props, state, conditional rendering |
| **Performance** | N+1 queries, unnecessary re-renders |
| **Auth Issues** | Token expiry, refresh logic, cookies |
| **Data Mismatch** | Type coercion, timezone, encoding |
