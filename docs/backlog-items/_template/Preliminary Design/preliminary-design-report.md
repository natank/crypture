# Preliminary Design Report Template

## Backlog Item
- **ID**: {ID}
- **Title**: {Title}
- **Requirement**: [REQ-XXX](../../../requirements/REQ-XXX-*.md)

---

## 1. UX/UI Design

### User Flow
```
{Step 1} → {Step 2} → {Step 3}
```

### Layout / Wireframe
```
┌─────────────────────────┐
│ {Component Layout}      │
└─────────────────────────┘
```

### Visual Considerations
- {Color, typography, spacing notes}

---

## 2. Technical Approach

### High-Level Architecture
```
{Data Flow Diagram}
```

### Key Decisions
| Decision | Rationale |
|----------|-----------|
| {Choice} | {Why} |

---

## 3. Component Overview

### New Components
| Component | Purpose | Location |
|-----------|---------|----------|
| {Name} | {Description} | `src/components/{Name}/` |

### Modified Components
| Component | Changes |
|-----------|---------|
| {Name} | {What changes} |

---

## 4. API / Data Changes

### New Types
```typescript
interface {TypeName} {
  field: type;
}
```

### Service Updates
| Service | Changes |
|---------|---------|
| {Name} | {Description} |

---

## 5. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| {Risk} | High/Medium/Low | {Strategy} |

---

## 6. Open Questions

- [ ] {Question requiring decision}
