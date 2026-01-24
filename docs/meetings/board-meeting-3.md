a board meeting held at Jan 13, 2026 at 7:50pm, UTC+02:00

## Agenda

1. Discuss the business plan draft (file: docs/master-plan/Phase 1 - Business Analysis and Backlog Refinement/outputs/business-plan-draft.md)

## Decisions
1. MVP launch is not already completed as specified in the business plan draft. The application looks good and ready to launch, but we need to consider some backend services support. currently the Coingecko API key is exposed in the code and rises security concerns. The API key should be stored in a secure environment and only used by internal services. Frontend should not have access to the API key. This backend service necessity should be reviewed by AI agent acting as a security expert.

### Security Expert Resolution (Follow-up)

**Date:** January 16, 2026  
**Updated Assessment:** Board security concerns are VALID and warrant immediate attention. The CoinGecko API key is exposed in frontend code, posing significant security risks including potential API key theft, rate limit abuse, and service disruption.

**Critical Context:** The website will be shut down for approximately 1 month for improvements, which eliminates the immediate security exposure window and allows for proper backend implementation.

**Recommendation:** Direct implementation of backend proxy service (no temporary frontend measures needed)

**Phase 1 (Immediate - During Shutdown Period):**
- Deploy backend proxy service (Node.js/Express)
- Secure API key storage server-side
- Enhanced caching with Redis layer (optional)
- IP-based and user-based rate limiting

**Phase 2 (Scale - 3-6 months post-launch):**
- Microservices architecture for market data
- Multiple API provider support for redundancy
- Advanced abuse detection and monitoring

**Rationale for Skipping Frontend Security Measures:**
- Website shutdown eliminates exposure window (no users can access frontend bundle)
- 1 month provides sufficient time for backend proxy implementation (2-3 weeks)
- Direct implementation avoids technical debt from temporary solutions
- Launch with proper security from day 1

**Final Decision:** APPROVE backend proxy implementation during shutdown period. Backend service is the correct long-term solution and should be implemented directly without intermediate frontend security measures.

### Product Owner Follow-up Tasks

**Backlog Items to be Created (Security Implementation Phases):**

| ID | Title | Priority | Feature Category | Target Phase | Story Points |
| :--- | :--- | :--- | :--- | :--- | :--- |
| SEC-01 | Deploy Backend Proxy Service (Node.js/Express) | High | Backend Services | Phase 1 | 8 |
| SEC-02 | Implement Server-side API Key Storage | High | Security Infrastructure | Phase 1 | 5 |
| SEC-03 | Add Enhanced Rate Limiting and Caching | High | Backend Services | Phase 1 | 5 |
| SEC-04 | Implement IP-based Rate Limiting | Medium | Security Infrastructure | Phase 1 | 5 |
| SEC-05 | Design Microservices Architecture for Market Data | Medium | Backend Services | Phase 2 | 8 |
| SEC-06 | Integrate Multiple API Providers for Redundancy | Medium | Backend Services | Phase 2 | 8 |
| SEC-07 | Implement Advanced Abuse Detection and Monitoring | Low | Security Infrastructure | Phase 2 | 5 |

**Implementation Strategy:**
- **Phase 1 Tasks (SEC-01 to SEC-04)**: Backend proxy implementation during shutdown period (2-3 weeks)
- **Phase 2 Tasks (SEC-05 to SEC-07)**: Scale and redundancy features, planned for Q2 2026

**Dependencies:**
- SEC-02 (Server-side Key Storage) depends on SEC-01 completion
- SEC-03 (Rate Limiting) integrates with SEC-01
- SEC-06 (Multiple API Providers) depends on SEC-05 completion

**Timeline:**
- Week 0: Shutdown website, begin SEC-01 development
- Week 1-2: Build backend proxy (SEC-01, SEC-02)
- Week 3: Testing, add rate limiting (SEC-03, SEC-04)
- Week 4: Final testing, deployment, relaunch with secure backend

**Acceptance Criteria:**
- All Phase 1 tasks: Zero API key exposure in frontend, server-side key management, 99.9% uptime
- All Phase 2 tasks: Multi-provider redundancy, real-time abuse detection

**Safety Net (Optional - 5 minutes):**
- Configure domain restrictions in CoinGecko dashboard as safety net for accidental early deployment

**Note:** These backlog items will be formally added to `product-backlog.md` following the established software development process, with full requirement documents and story breakdowns for each phase.