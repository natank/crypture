# Feature Ideas — Board Review

> **Review Date:** December 2024  
> **Reviewer:** Board Advisory Assessment  
> **Context:** Ideas evaluated against product vision, current backlog priorities, and strategic fit.

---

## Evaluation Criteria

| Criterion | Weight | Description |
|:----------|:------:|:------------|
| Strategic Alignment | 25% | Fit with product vision and target users |
| Market Opportunity | 25% | Revenue potential and competitive differentiation |
| User Value | 20% | Direct benefit to existing/new user segments |
| Technical Feasibility | 15% | Implementation complexity relative to team capacity |
| Resource Efficiency | 15% | Development effort vs. expected return |

**Scoring:** 1–5 scale (1 = Poor, 5 = Excellent)

---

## Idea 1: Partner/Advisor Support (B2B)

### Description
Enable financial advisors, wealth managers, or crypto-savvy individuals to manage portfolios on behalf of their clients. This would position Crypture as a B2B tool for professional portfolio management services.

### Detailed Analysis

**Pros:**
- Opens a new revenue stream (subscription/licensing model)
- Differentiates from consumer-only competitors
- Partners could drive organic user acquisition

**Cons:**
- Significant pivot from current vision ("everyday crypto investors," "no login required")
- Requires user authentication (currently low-priority pending item)
- Introduces compliance considerations (fiduciary responsibilities, audit trails)
- Multi-tenancy architecture adds substantial technical complexity
- Dilutes focus on simplicity—a core brand differentiator

### Scores

| Criterion | Score | Notes |
|:----------|:-----:|:------|
| Strategic Alignment | 2 | Conflicts with privacy-first, no-login vision |
| Market Opportunity | 4 | B2B crypto tools underserved; monetization potential |
| User Value | 2 | Benefits new segment, not current target users |
| Technical Feasibility | 2 | Requires auth, roles, permissions, audit logs |
| Resource Efficiency | 2 | High effort for uncertain product-market fit |

**Weighted Score: 2.5 / 5**

### Resolution: ❌ DEFER

**Recommendation:** Do not add to backlog at this stage. This represents a strategic pivot rather than an enhancement. Revisit only after:
1. User authentication (Item 13) is implemented
2. Market validation confirms demand from advisor segment
3. Core consumer feature roadmap is substantially complete

---

## Idea 2: Portfolio Sharing (Relative Data)

### Description
Allow users to share portfolio composition with partners, services, or other users—exposing only relative allocation (percentages) rather than absolute values. This preserves privacy while enabling social/collaborative features.

### Detailed Analysis

**Pros:**
- Aligns with privacy-first philosophy (no absolute values exposed)
- Enables social proof, community engagement, and viral growth
- Could integrate with existing export functionality
- Low barrier for users to share strategies without financial exposure
- Potential for "copy portfolio" feature expansion

**Cons:**
- Requires share link generation and management
- Needs consideration for expiration, revocation of shared links
- May require backend infrastructure for link persistence

### Scores

| Criterion | Score | Notes |
|:----------|:-----:|:------|
| Strategic Alignment | 4 | Privacy-respecting sharing fits vision |
| Market Opportunity | 4 | Social/viral features drive growth |
| User Value | 4 | Enables collaboration without risk |
| Technical Feasibility | 4 | Builds on existing export infrastructure |
| Resource Efficiency | 4 | Moderate effort, high potential return |

**Weighted Score: 4.0 / 5**

### Resolution: ✅ RECOMMEND FOR BACKLOG

**Recommendation:** Add to Post-MVP backlog under **User Engagement** category.

**Suggested Story:**
- **ID:** 29
- **Title:** Share Portfolio Composition (Privacy-Preserving)
- **Priority:** Medium
- **Feature Category:** User Engagement
- **Related Requirement:** New REQ-015-sharing

---

## Idea 3: Portfolio Planning Sandbox

### Description
Create a sandbox environment where users can simulate portfolio changes, test allocation strategies, and model "what-if" scenarios without affecting their actual portfolio.

### Detailed Analysis

**Pros:**
- Directly serves "New Crypto Enthusiasts" segment (simulate and understand holdings)
- Educational value aligns with product goal of understanding without expertise
- No-risk experimentation increases user confidence
- Natural extension of core portfolio functionality
- Differentiator—few simple trackers offer simulation

**Cons:**
- Requires parallel data structures (sandbox vs. real portfolio)
- UX complexity in switching between modes
- Could confuse users if not clearly distinguished

### Scores

| Criterion | Score | Notes |
|:----------|:-----:|:------|
| Strategic Alignment | 5 | Directly supports target user needs |
| Market Opportunity | 3 | Differentiation value; indirect monetization |
| User Value | 5 | High educational and decision-support value |
| Technical Feasibility | 3 | Moderate complexity; state management |
| Resource Efficiency | 3 | Medium effort, strong user value |

**Weighted Score: 3.9 / 5**

### Resolution: ✅ RECOMMEND FOR BACKLOG

**Recommendation:** Add to Post-MVP backlog under **Investment Research** category.

**Suggested Story:**
- **ID:** 30
- **Title:** Portfolio Planning Sandbox
- **Priority:** Medium
- **Feature Category:** Investment Research
- **Related Requirement:** New REQ-016-sandbox

---

## Idea 4: Change History / Audit Trail

### Description
Track and display historical changes to portfolio and/or sandbox—including additions, deletions, quantity edits, and timestamps.

### Detailed Analysis

**Pros:**
- Essential for user trust and transparency
- Enables "undo" functionality and error recovery
- Supports portfolio performance tracking (Item 22) with historical context
- Required foundation if B2B/advisor features are ever pursued
- Minimal additional UI footprint (history drawer/modal)

**Cons:**
- Increases local storage requirements significantly
- Requires migration strategy for existing users
- History retention policy decisions needed

### Scores

| Criterion | Score | Notes |
|:----------|:-----:|:------|
| Strategic Alignment | 4 | Supports clarity and control goals |
| Market Opportunity | 3 | Expected feature; not a differentiator |
| User Value | 4 | Error recovery and insight value |
| Technical Feasibility | 4 | Straightforward event logging |
| Resource Efficiency | 4 | Moderate effort, foundational value |

**Weighted Score: 3.75 / 5**

### Resolution: ✅ RECOMMEND FOR BACKLOG

**Recommendation:** Add to Post-MVP backlog under **Advanced Analytics** category. Consider bundling with Portfolio Performance Tracking (Item 22) enhancements.

**Suggested Story:**
- **ID:** 31
- **Title:** Portfolio Change History
- **Priority:** Medium
- **Feature Category:** Advanced Analytics
- **Related Requirement:** Extend REQ-022-portfolio-performance

---

## Summary Matrix

| Idea | Weighted Score | Resolution | Recommended Priority |
|:-----|:--------------:|:----------:|:---------------------|
| 1. Partner/Advisor Support | 2.5 | ❌ Defer | — |
| 2. Portfolio Sharing (Relative) | 4.0 | ✅ Backlog | Medium |
| 3. Portfolio Planning Sandbox | 3.9 | ✅ Backlog | Medium |
| 4. Change History | 3.75 | ✅ Backlog | Medium |

---

## Board Commentary

The three approved ideas share a common thread: they enhance user autonomy, education, and engagement without compromising the privacy-first, no-login philosophy that differentiates Crypture. They build naturally on the existing technical foundation and align with the stated product goals.

The Partner/Advisor feature, while commercially attractive, represents a fundamental shift in product positioning. It should only be reconsidered after establishing product-market fit with the consumer segment and completing foundational infrastructure (authentication, multi-user support).

**Recommended sequencing:**
1. **Change History** — Foundational; enables #2 and #3
2. **Portfolio Sharing** — Growth driver; leverages history for "shared at" context
3. **Sandbox** — Differentiation; requires stable history mechanism

---

*Document maintained by Product Board. Next review: Q2 2025.*
