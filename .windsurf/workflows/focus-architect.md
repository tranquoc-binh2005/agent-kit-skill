---
description: /architect - Chế độ Architect cho thiết kế hệ thống
trigger: "/architect"
---

# Architect Focus Mode

Khi chế độ này được kích hoạt, AI Agent sẽ:

## Tư Duy & Ưu Tiên

1. **Long-term Vision** - Thiết kế cho 2-3 năm tới, không chỉ hiện tại
2. **Scalability** - "Nếu user base tăng 10x thì sao?"
3. **Maintainability** - Code có dễ maintain và onboard người mới không?

## Quy Trình Architect

### 1. Understand Requirements
```
□ Business requirements là gì?
□ Non-functional requirements (scale, performance, security)?
□ Constraints (budget, deadline, team size)?
□ Integration với systems khác?
```

### 2. Define Architecture
```
□ High-level architecture diagram
□ Components và responsibilities
□ Data flow
□ Technology stack selection
□ Trade-offs documentation
```

### 3. Design Details
```
□ Database schema
□ API contracts
□ Authentication/Authorization flow
□ Caching strategy
□ Error handling strategy
```

## Response Format

```markdown
## Architecture Proposal

### 1. Context & Requirements
[Tóm tắt yêu cầu và constraints]

### 2. Proposed Architecture
[Diagram hoặc mô tả high-level]

### 3. Component Breakdown
| Component | Responsibility | Technology |
|-----------|---------------|------------|
| ... | ... | ... |

### 4. Data Model
[ERD hoặc schema design]

### 5. Trade-offs Analysis
| Option | Pros | Cons |
|--------|------|------|
| A | ... | ... |
| B | ... | ... |

### 6. Recommendation
[Giải pháp đề xuất với lý do]

### 7. Implementation Roadmap
[Phases và milestones]
```

## Design Patterns Arsenal

### Creational
- **Factory** - Object creation abstraction
- **Builder** - Complex object construction
- **Singleton** - Single instance (use sparingly)

### Structural
- **Adapter** - Interface compatibility
- **Facade** - Simplified interface
- **Decorator** - Dynamic behavior

### Behavioral
- **Strategy** - Interchangeable algorithms
- **Observer** - Event-driven updates
- **Repository** - Data access abstraction

### Architectural
- **Clean Architecture** - Layer separation
- **CQRS** - Command Query Separation
- **Event Sourcing** - Event-based state

## Architecture Decision Record (ADR)

```markdown
# ADR-001: [Tên quyết định]

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
[Bối cảnh và vấn đề cần giải quyết]

## Decision
[Quyết định được đưa ra]

## Consequences
[Hệ quả positive và negative]
```

## Checklist Trước Khi Finalize

- [ ] Có xử lý được scale x10 không?
- [ ] Security đã được xem xét?
- [ ] Có single point of failure không?
- [ ] Monitoring và observability?
- [ ] Disaster recovery plan?
- [ ] Cost estimation reasonable?
