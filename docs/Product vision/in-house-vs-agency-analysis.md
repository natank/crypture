# In-House vs Agency Services Analysis

**Context:** Evaluating whether to outsource proposed consulting services or execute in-house using AI-assisted development  
**Date:** December 2024

---

## Executive Summary

Given our proven track record of delivering a comprehensive MVP using Developer + AI tools (Windsurf, Cursor, Claude), we have strong capability to execute both proposed services in-house. This report analyzes the feasibility, cost savings, and trade-offs of each approach.

**Recommendation:** Execute both services in-house with selective external validation.

---

## Current Capabilities Assessment

### Proven Delivery Track Record

Our team has successfully delivered **27+ backlog items** spanning:

| Category | Items Delivered | Complexity |
|----------|-----------------|------------|
| Core Portfolio Management | 5 features | High |
| Real-Time Data Integration | 2 features | High |
| UI and Usability | 9 features | Medium-High |
| Extended Features | 5 features | Medium |
| Market Intelligence | 3 features | High |
| Advanced Analytics | 3 features | High |
| User Engagement | 2 features | Medium |
| Investment Research | 3 features | Medium |
| Technical Debt | 4 refactors | Medium |

### AI Tools in Our Stack

| Tool | Capability | Proven Use |
|------|------------|------------|
| **Windsurf/Cascade** | Full-stack development, code generation, documentation | All backlog items |
| **Cursor** | Code editing, refactoring, pair programming | Development workflow |
| **Claude** | Strategic analysis, documentation, business writing | Requirements, design docs |

### Existing Documentation Infrastructure

- `software-development-plan.md` — Structured SDLC process
- `product-vision.md` — Clear product positioning
- `product-backlog.md` — Comprehensive feature tracking
- Design tokens and component library already established
- UI mockups and design system documentation

---

## Service 1: Business Plan Analysis

### Agency Proposal
- **Duration:** ~45 days
- **Team:** Project Manager + Business Consultant
- **Cost:** Estimated $3,000-5,000
- **Deliverables:** Market analysis, revenue projections, break-even analysis, KSF identification

### In-House Feasibility: ✅ HIGH

| Component | AI Tool Capability | Feasibility |
|-----------|-------------------|-------------|
| Market Analysis | Claude can synthesize market data, competitor analysis (already done in consulting presentation) | ✅ High |
| Revenue Projections | Claude can model SaaS economics, subscription tiers, conversion rates | ✅ High |
| Cost Projections | Developer has direct knowledge of infrastructure costs | ✅ High |
| Break-even Analysis | Standard financial modeling, AI-assisted | ✅ High |
| SWOT/Competitive Analysis | Already partially completed in consulting summary | ✅ High |
| Go-to-Market Strategy | Claude excels at strategic planning | ✅ High |

### In-House Approach

**Phase 1: Market Research (3-5 days)**
```
AI Tools: Claude + Web Search
- Validate market size data from consulting presentation
- Deep-dive competitor pricing and features
- Identify market gaps and positioning opportunities
```

**Phase 2: Financial Modeling (3-5 days)**
```
AI Tools: Claude + Spreadsheet
- Build SaaS revenue model (Free/Premium/Pro tiers)
- Cost structure analysis (infrastructure, API costs, marketing)
- Break-even scenarios (conservative, moderate, aggressive)
- 3-year projections
```

**Phase 3: Strategy Documentation (3-5 days)**
```
AI Tools: Claude + Windsurf
- Executive summary
- Go-to-market strategy
- Monetization roadmap
- Risk mitigation plan
- Investor-ready formatting
```

### Cost Comparison

| Approach | Duration | Cost | Quality |
|----------|----------|------|---------|
| Agency | 45 days | $3,000-5,000 | Professional, external validation |
| In-House | 10-15 days | ~$500 (tools + time) | Good, needs validation |
| **Hybrid** | 20 days | ~$1,500 | Best of both |

### Hybrid Recommendation
1. **In-house:** Create business plan using AI tools (10-15 days)
2. **External:** Hire consultant for 2-3 hour review/validation ($200-400)
3. **Savings:** ~$2,500-4,000

---

## Service 2: UI/UX Design Analysis

### Agency Proposal
- **Duration:** ~25 days
- **Team:** Project Manager + UI/UX Designer
- **Cost:** Estimated $2,000-3,000
- **Deliverables:** 10 screens in Figma, clickable prototype, component library, design system

### In-House Feasibility: ⚠️ MEDIUM-HIGH

| Component | AI Tool Capability | Feasibility |
|-----------|-------------------|-------------|
| UX Research | Claude can analyze user needs, create personas | ✅ High |
| Information Architecture | Claude can structure user flows | ✅ High |
| Wireframes | AI tools can generate wireframe concepts | ✅ Medium |
| Visual Design | AI image tools (Midjourney, DALL-E) + existing design system | ⚠️ Medium |
| Figma Mockups | Requires manual work, but AI can guide | ⚠️ Medium |
| Clickable Prototype | Figma skills needed, or code-based prototype | ⚠️ Medium |
| Component Library | **Already exists** in codebase | ✅ Done |
| Design System | **Already established** (design tokens, brand colors) | ✅ Done |

### Key Advantage: We Already Have a Working Product

Unlike a greenfield project, we have:
- ✅ Live product at foliocrypto.netlify.app
- ✅ Established design tokens and brand identity
- ✅ React component library with TailwindCSS
- ✅ Responsive layouts already implemented
- ✅ Accessibility utilities (sr-only, focus-ring, tap-44)

### Critical Gap in Agency Workflow: Backlog Definition

**Agency's Missing Step:**
The consulting agency's workflow jumps from Business Analysis (Service 1) directly to UI/UX Design (Service 2) without the crucial intermediate step of **backlog adaptation and user story definition**. This creates:

- ❌ Design work without clear acceptance criteria
- ❌ No prioritization framework for which features to design
- ❌ Disconnect between business insights and implementable features
- ❌ Risk of designing features misaligned with MVP scope or monetization strategy

**In-House Advantage:**
We already have a **proven backlog management process** with 27+ completed stories, making this gap a non-issue:

✅ **Existing Backlog Infrastructure** — Structured product backlog with priority levels and feature categories  
✅ **Requirements Mapping** — Each story linked to detailed requirement documents  
✅ **AI-Assisted Refinement** — Claude can analyze business insights and generate prioritized user stories  
✅ **Iterative Validation** — Stories validated through actual implementation, not theoretical design  

**Backlog Adaptation Workflow (3-5 days):**
```
1. Analyze consulting presentation insights (target segments, KSFs)
2. Map business goals to feature priorities using Claude
3. Define next-phase user stories with acceptance criteria
4. Prioritize: Investor Demo features vs. Post-Funding roadmap
5. Select 10 key screens based on story priorities
6. Output: Prioritized backlog → Input for UX design
```

This step is **embedded naturally** in our development workflow and costs $0 additional (vs. undefined in agency proposal).

### In-House Approach

**Option A: Code-First Design (Recommended)**
```
Duration: 10-15 days
Tools: Windsurf + Claude + TailwindCSS

1. Identify 10 key screens for investor presentation
2. Polish existing screens using AI-assisted refinement
3. Create new screens directly in React/TailwindCSS
4. Generate screenshots for presentation
5. Use Storybook for component showcase
```

**Advantages:**
- Designs are immediately implementable (no handoff friction)
- Leverages existing component library
- Changes can be deployed instantly
- Developer maintains full control

**Option B: Figma-First Design**
```
Duration: 15-20 days
Tools: Figma + AI design plugins + Claude for UX guidance

1. Export current designs to Figma (screenshot-based)
2. Use AI plugins (Magician, Diagram) for enhancements
3. Create clickable prototype
4. Iterate based on feedback
```

**Challenges:**
- Requires Figma proficiency
- Creates design-to-code handoff overhead
- May diverge from actual implementation

### Cost Comparison

| Approach | Duration | Cost | Quality |
|----------|----------|------|---------|
| Agency | 25 days | $2,000-3,000 | Professional Figma deliverables |
| In-House (Code-First) | 10-15 days | ~$300 (tools) | Production-ready, consistent |
| In-House (Figma) | 15-20 days | ~$500 (Figma + plugins) | Good, requires learning |
| **Hybrid** | 15 days | ~$1,000 | Professional polish |

### Hybrid Recommendation
1. **In-house:** Polish 10 key screens in code (10 days)
2. **External:** Hire designer for landing page hero + marketing assets only ($500-800)
3. **Savings:** ~$1,200-2,000

---

## Comparative Analysis Summary

### Total Cost Comparison

| Service | Agency Cost | In-House Cost | Hybrid Cost | Savings |
|---------|-------------|---------------|-------------|---------|
| Business Plan | $3,000-5,000 | $500 | $1,500 | $1,500-3,500 |
| UI/UX Design | $2,000-3,000 | $300-500 | $1,000 | $1,000-2,000 |
| **Total** | **$5,000-8,000** | **$800-1,000** | **$2,500** | **$2,500-5,500** |

### Timeline Comparison

| Service | Agency Timeline | In-House Timeline | Hybrid Timeline |
|---------|-----------------|-------------------|-----------------|
| Business Plan | 45 days | 10-15 days | 20 days |
| UI/UX Design | 25 days | 10-15 days | 15 days |
| **Total** | **70 days** | **20-30 days** | **35 days** |

---

## Risk Analysis

### In-House Risks

| Risk | Mitigation |
|------|------------|
| Lack of external perspective | Schedule validation calls with advisors/mentors |
| Design quality concerns | Use established design systems (shadcn/ui, TailwindUI) as reference |
| Business plan credibility | Include market data citations, use professional templates |
| Time commitment | Developer focus split between product and business tasks |

### Agency Risks

| Risk | Mitigation |
|------|------------|
| Misaligned deliverables | Clear requirements, milestone reviews |
| Communication overhead | Regular check-ins, async tools |
| Design-code mismatch | Involve developer in design reviews |
| Cost overruns | Fixed-price contracts, scope limits |

---

## Recommended Approach: Hybrid Model

### Phase 1: In-House Foundation (Weeks 1-3)

**Business Plan (In-House)**
- Use Claude to draft comprehensive business plan
- Leverage consulting presentation data as foundation
- Create financial models in spreadsheet
- Document go-to-market strategy

**Backlog Adaptation & Story Definition (In-House)** ⭐ NEW
- Analyze business insights from consulting presentation
- Refine product backlog based on target market segments (Beginners, Privacy-Conscious, Power Users)
- Define next-phase user stories aligned with monetization strategy
- Prioritize features for investor demo vs. post-funding roadmap
- Map stories to 10 key screens for design focus

**UI/UX Polish (In-House)**
- Identify 10 key screens for investor presentation (based on backlog priorities)
- Polish using existing design system
- Create Storybook showcase
- Generate high-quality screenshots

### Phase 2: External Validation (Week 4)

**Business Plan Review**
- Hire Fiverr/Upwork consultant for 2-3 hour review
- Focus on financial model validation
- Get feedback on investor readiness
- **Budget:** $200-400

**Design Assets**
- Hire designer for landing page hero section
- Create marketing asset kit (social banners, app store graphics)
- **Budget:** $500-800

### Phase 3: Finalization (Week 5)

- Incorporate feedback
- Final polish and formatting
- Prepare investor-ready materials

---

## Decision Matrix

| Criteria | Weight | Agency | In-House | Hybrid |
|----------|--------|--------|----------|--------|
| Cost | 25% | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Speed | 20% | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Quality | 20% | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Flexibility | 15% | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| External Credibility | 10% | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| Learning/Control | 10% | ⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Weighted Score** | | **2.85** | **4.05** | **4.00** |

---

## Final Recommendation

### ✅ Execute Both Services In-House with Selective External Validation

**Rationale:**
1. **Proven capability** — 27+ features delivered using AI tools demonstrates execution ability
2. **Existing assets** — Design system, component library, and product vision already established
3. **Cost efficiency** — Save $2,500-5,500 compared to full agency engagement
4. **Speed advantage** — 35-50% faster delivery (35 days vs 70 days)
5. **Flexibility** — Iterate quickly without agency coordination overhead
6. **Learning value** — Team gains business planning and design skills

**Investment:**
- In-house effort: ~$800-1,000 (tools + developer time)
- External validation: ~$700-1,200
- **Total: ~$1,500-2,200** (vs $5,000-8,000 agency)

**Timeline:** 5 weeks (vs 10+ weeks agency)

---

## Next Steps

1. [ ] Board decision on approach (In-House vs Hybrid vs Agency)
2. [ ] If Hybrid approved:
   - [ ] **Week 1: Business Analysis & Backlog Refinement**
     - [ ] Begin business plan draft using Claude
     - [ ] Analyze consulting insights for target segment priorities
     - [ ] Refine product backlog with next-phase user stories
     - [ ] Map business goals to feature priorities
   - [ ] **Week 2: Feature Prioritization & Financial Modeling**
     - [ ] Prioritize features: Investor Demo vs. Post-Funding roadmap
     - [ ] Select 10 key screens based on backlog priorities
     - [ ] Complete financial modeling
   - [ ] **Weeks 2-3: UI/UX Implementation**
     - [ ] Polish UI screens in code (based on prioritized backlog)
     - [ ] Create Storybook showcase
   - [ ] **Week 3: External Validation Sourcing**
     - [ ] Source external reviewers on Fiverr/Upwork
   - [ ] **Weeks 4-5: Validation & Finalization**
     - [ ] Business plan review
     - [ ] Design feedback incorporation
     - [ ] Final investor-ready materials

---

*Analysis prepared using AI-assisted strategic planning*
