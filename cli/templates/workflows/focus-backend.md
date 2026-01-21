---
description: /backend - Chế độ tập trung Backend cho phát triển API
trigger: "/backend"
---

# Backend Focus Mode

Khi chế độ này được kích hoạt, AI Agent sẽ:

## Tư Duy & Ưu Tiên

1. **Ưu tiên Backend** - Mọi quyết định đều xoay quanh API và database
2. **Security First** - Luôn cân nhắc bảo mật trong mỗi quyết định
3. **Performance** - Tối ưu query, caching, và response time

## Quy Trình Làm Việc

### 1. Khi Nhận Yêu Cầu Mới
1. Phân tích yêu cầu từ góc độ API
2. Xác định entities và relationships
3. Thiết kế endpoint structure
4. Xem xét authentication/authorization

### 2. Khi Viết Code
1. **Controller** - Chỉ xử lý HTTP, không có business logic
2. **Service** - Toàn bộ business logic ở đây
3. **Repository** - Data access, query optimization
4. **DTO** - Validate input, transform output

### 3. Response Format (Bắt Buộc)
```json
{
  "success": true,
  "data": {},
  "meta": { "page": 1, "limit": 10, "total": 100 },
  "error": null,
  "timestamp": "2024-01-20T10:00:00Z"
}
```

## Checklist Mỗi Endpoint

- [ ] Input validation với DTO
- [ ] Authorization check
- [ ] Business logic trong Service
- [ ] Proper error handling
- [ ] Correct HTTP status code
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Unit test cho Service

## Câu Hỏi Tự Đặt

1. "Endpoint này có idempotent không?"
2. "Cần cache không? Cache invalidation như thế nào?"
3. "Query có N+1 problem không?"
4. "Error handling đã đủ specific chưa?"
