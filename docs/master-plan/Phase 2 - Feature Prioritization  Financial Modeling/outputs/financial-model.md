# Financial Model

**Document:** Phase 2 Output - Hybrid Master Plan  
**Version:** 1.0  
**Date:** January 2025

---

## Executive Summary

This document provides Crypture's 3-year financial projections with conservative, moderate, and aggressive scenarios. It includes detailed assumptions, revenue model, cost structure, P&L projections, break-even analysis, and sensitivity analysis. This serves as the specification for the `financial-model.xlsx` spreadsheet.

---

## Model Structure (Spreadsheet Tabs)

```
Tab 1: Assumptions
Tab 2: Revenue Model
Tab 3: Cost Structure
Tab 4: P&L Projection
Tab 5: Break-even Analysis
Tab 6: Sensitivity Analysis
Tab 7: Unit Economics
Tab 8: Funding & Runway
```

---

## Tab 1: Assumptions

### User Growth Assumptions

| Assumption | Conservative | Moderate | Aggressive |
|------------|--------------|----------|------------|
| **Month 1 Users** | 500 | 1,000 | 2,000 |
| **Monthly Growth Rate (Y1)** | 10% | 15% | 20% |
| **Monthly Growth Rate (Y2)** | 8% | 12% | 15% |
| **Monthly Growth Rate (Y3)** | 5% | 8% | 10% |

### Conversion Assumptions

| Assumption | Conservative | Moderate | Aggressive |
|------------|--------------|----------|------------|
| **Free → Premium (Y1)** | 3% | 5% | 7% |
| **Free → Premium (Y2)** | 4% | 6% | 9% |
| **Free → Premium (Y3)** | 5% | 7% | 10% |
| **Free → Pro (All Years)** | 0.5% | 1% | 1.5% |

### Churn Assumptions

| Assumption | Conservative | Moderate | Aggressive |
|------------|--------------|----------|------------|
| **Premium Monthly Churn** | 6% | 5% | 4% |
| **Pro Monthly Churn** | 4% | 3% | 2% |

### Pricing Assumptions

| Tier | Monthly | Annual | Discount |
|------|---------|--------|----------|
| **Premium** | $9.99 | $99 | 17% |
| **Pro** | $19.99 | $199 | 17% |
| **Annual Adoption Rate** | 30% | 35% | 40% |

### Cost Assumptions

| Category | Y1 Monthly | Y2 Monthly | Y3 Monthly |
|----------|------------|------------|------------|
| **Infrastructure** | $500 | $2,000 | $5,000 |
| **API Costs (per 1K users)** | $50 | $40 | $30 |
| **Payment Processing** | 2.9% + $0.30 | 2.9% + $0.30 | 2.9% + $0.30 |
| **Support (per 1K users)** | $200 | $150 | $100 |

---

## Tab 2: Revenue Model

### Monthly User Projections (Moderate Scenario)

#### Year 1 (Monthly)

| Month | Total Users | Growth | Free Users | Premium | Pro |
|-------|-------------|--------|------------|---------|-----|
| 1 | 1,000 | — | 940 | 50 | 10 |
| 2 | 1,150 | 15% | 1,081 | 58 | 12 |
| 3 | 1,323 | 15% | 1,243 | 66 | 13 |
| 4 | 1,521 | 15% | 1,430 | 76 | 15 |
| 5 | 1,749 | 15% | 1,644 | 87 | 17 |
| 6 | 2,012 | 15% | 1,891 | 101 | 20 |
| 7 | 2,313 | 15% | 2,175 | 116 | 23 |
| 8 | 2,660 | 15% | 2,501 | 133 | 27 |
| 9 | 3,059 | 15% | 2,876 | 153 | 31 |
| 10 | 3,518 | 15% | 3,307 | 176 | 35 |
| 11 | 4,046 | 15% | 3,803 | 202 | 40 |
| 12 | 4,653 | 15% | 4,374 | 233 | 47 |

**Year 1 End:** ~50,000 users (cumulative with churn adjustments)

#### Year 2 (Quarterly)

| Quarter | Total Users | Free Users | Premium | Pro |
|---------|-------------|------------|---------|-----|
| Q1 | 75,000 | 69,000 | 5,250 | 750 |
| Q2 | 112,500 | 103,500 | 7,875 | 1,125 |
| Q3 | 150,000 | 138,000 | 10,500 | 1,500 |
| Q4 | 200,000 | 184,000 | 14,000 | 2,000 |

#### Year 3 (Quarterly)

| Quarter | Total Users | Free Users | Premium | Pro |
|---------|-------------|------------|---------|-----|
| Q1 | 260,000 | 237,900 | 19,500 | 2,600 |
| Q2 | 340,000 | 311,100 | 25,500 | 3,400 |
| Q3 | 450,000 | 411,750 | 33,750 | 4,500 |
| Q4 | 600,000 | 549,000 | 45,000 | 6,000 |

### Monthly Recurring Revenue (MRR) Projections

#### Year 1 MRR (Moderate)

| Month | Premium MRR | Pro MRR | Total MRR |
|-------|-------------|---------|-----------|
| 1 | $500 | $200 | $700 |
| 2 | $575 | $230 | $805 |
| 3 | $661 | $265 | $926 |
| 4 | $760 | $304 | $1,064 |
| 5 | $874 | $350 | $1,224 |
| 6 | $1,005 | $402 | $1,407 |
| 7 | $1,156 | $463 | $1,619 |
| 8 | $1,329 | $532 | $1,861 |
| 9 | $1,529 | $612 | $2,141 |
| 10 | $1,758 | $704 | $2,462 |
| 11 | $2,022 | $809 | $2,831 |
| 12 | $2,325 | $931 | $3,256 |

**Year 1 Total Revenue:** ~$20,000 (cumulative monthly)

#### Annual Revenue Summary (All Scenarios)

| Year | Conservative | Moderate | Aggressive |
|------|--------------|----------|------------|
| **Year 1** | $120,000 | $180,000 | $300,000 |
| **Year 2** | $800,000 | $1,800,000 | $3,500,000 |
| **Year 3** | $2,500,000 | $6,480,000 | $12,000,000 |

---

## Tab 3: Cost Structure

### Fixed Costs (Monthly)

| Category | Year 1 | Year 2 | Year 3 |
|----------|--------|--------|--------|
| **Personnel** | | | |
| - Engineering (FTEs) | $12,500 (1.5) | $33,333 (4) | $75,000 (9) |
| - Marketing (FTEs) | $4,167 (0.5) | $8,333 (1) | $16,667 (2) |
| - Operations (FTEs) | $0 (0) | $4,167 (0.5) | $8,333 (1) |
| **Subtotal Personnel** | $16,667 | $45,833 | $100,000 |
| **Infrastructure** | | | |
| - Hosting (Netlify/AWS) | $200 | $800 | $2,500 |
| - CDN & Storage | $100 | $400 | $1,000 |
| - Dev Tools & Services | $200 | $400 | $800 |
| **Subtotal Infrastructure** | $500 | $1,600 | $4,300 |
| **Operations** | | | |
| - Legal & Compliance | $500 | $1,000 | $2,000 |
| - Accounting | $300 | $600 | $1,200 |
| - Insurance | $200 | $400 | $800 |
| - Office/Misc | $200 | $400 | $1,000 |
| **Subtotal Operations** | $1,200 | $2,400 | $5,000 |
| **TOTAL FIXED** | $18,367 | $49,833 | $109,300 |

### Variable Costs

| Category | Cost Basis | Year 1 | Year 2 | Year 3 |
|----------|------------|--------|--------|--------|
| **API Costs** | Per 1K users/mo | $2,500 | $8,000 | $18,000 |
| **Payment Processing** | 2.9% + $0.30 | $500 | $5,500 | $19,000 |
| **Customer Support** | Per 1K users/mo | $1,000 | $4,000 | $12,000 |
| **Marketing Spend** | As budgeted | $8,333 | $25,000 | $50,000 |
| **TOTAL VARIABLE** | | $12,333 | $42,500 | $99,000 |

### Total Monthly Costs

| Year | Fixed | Variable | Total Monthly | Annual |
|------|-------|----------|---------------|--------|
| **Year 1** | $18,367 | $12,333 | $30,700 | $368,400 |
| **Year 2** | $49,833 | $42,500 | $92,333 | $1,108,000 |
| **Year 3** | $109,300 | $99,000 | $208,300 | $2,499,600 |

---

## Tab 4: P&L Projection

### Year 1 P&L (Moderate Scenario)

| Line Item | Q1 | Q2 | Q3 | Q4 | Year 1 |
|-----------|-----|-----|-----|-----|--------|
| **Revenue** | | | | | |
| Premium Revenue | $5,000 | $15,000 | $35,000 | $65,000 | $120,000 |
| Pro Revenue | $2,000 | $6,000 | $14,000 | $38,000 | $60,000 |
| **Total Revenue** | $7,000 | $21,000 | $49,000 | $103,000 | $180,000 |
| **COGS** | | | | | |
| API Costs | $1,500 | $3,000 | $5,000 | $8,000 | $17,500 |
| Payment Processing | $300 | $800 | $1,800 | $3,500 | $6,400 |
| Support | $500 | $1,500 | $3,000 | $5,000 | $10,000 |
| **Total COGS** | $2,300 | $5,300 | $9,800 | $16,500 | $33,900 |
| **Gross Profit** | $4,700 | $15,700 | $39,200 | $86,500 | $146,100 |
| **Gross Margin** | 67% | 75% | 80% | 84% | 81% |
| **Operating Expenses** | | | | | |
| Personnel | $50,000 | $50,000 | $50,000 | $50,000 | $200,000 |
| Infrastructure | $1,500 | $1,500 | $1,500 | $1,500 | $6,000 |
| Marketing | $25,000 | $25,000 | $25,000 | $25,000 | $100,000 |
| Operations | $3,600 | $3,600 | $3,600 | $3,600 | $14,400 |
| **Total OpEx** | $80,100 | $80,100 | $80,100 | $80,100 | $320,400 |
| **EBITDA** | -$75,400 | -$64,400 | -$40,900 | $6,400 | -$174,300 |
| **EBITDA Margin** | -1077% | -307% | -83% | 6% | -97% |

### Year 2 P&L (Moderate Scenario)

| Line Item | Q1 | Q2 | Q3 | Q4 | Year 2 |
|-----------|-----|-----|-----|-----|--------|
| **Revenue** | | | | | |
| Premium Revenue | $150,000 | $250,000 | $380,000 | $540,000 | $1,320,000 |
| Pro Revenue | $45,000 | $75,000 | $115,000 | $165,000 | $400,000 |
| **Total Revenue** | $195,000 | $325,000 | $495,000 | $705,000 | $1,720,000 |
| **COGS** | $29,250 | $48,750 | $74,250 | $105,750 | $258,000 |
| **Gross Profit** | $165,750 | $276,250 | $420,750 | $599,250 | $1,462,000 |
| **Gross Margin** | 85% | 85% | 85% | 85% | 85% |
| **Operating Expenses** | $200,000 | $225,000 | $250,000 | $275,000 | $950,000 |
| **EBITDA** | -$34,250 | $51,250 | $170,750 | $324,250 | $512,000 |
| **EBITDA Margin** | -18% | 16% | 34% | 46% | 30% |

### Year 3 P&L (Moderate Scenario)

| Line Item | Q1 | Q2 | Q3 | Q4 | Year 3 |
|-----------|-----|-----|-----|-----|--------|
| **Revenue** | | | | | |
| Premium Revenue | $700,000 | $950,000 | $1,300,000 | $1,750,000 | $4,700,000 |
| Pro Revenue | $200,000 | $280,000 | $380,000 | $520,000 | $1,380,000 |
| **Total Revenue** | $900,000 | $1,230,000 | $1,680,000 | $2,270,000 | $6,080,000 |
| **COGS** | $135,000 | $184,500 | $252,000 | $340,500 | $912,000 |
| **Gross Profit** | $765,000 | $1,045,500 | $1,428,000 | $1,929,500 | $5,168,000 |
| **Gross Margin** | 85% | 85% | 85% | 85% | 85% |
| **Operating Expenses** | $500,000 | $525,000 | $550,000 | $575,000 | $2,150,000 |
| **EBITDA** | $265,000 | $520,500 | $878,000 | $1,354,500 | $3,018,000 |
| **EBITDA Margin** | 29% | 42% | 52% | 60% | 50% |

### 3-Year P&L Summary

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| **Revenue** | $180,000 | $1,720,000 | $6,080,000 |
| **COGS** | $33,900 | $258,000 | $912,000 |
| **Gross Profit** | $146,100 | $1,462,000 | $5,168,000 |
| **Gross Margin** | 81% | 85% | 85% |
| **OpEx** | $320,400 | $950,000 | $2,150,000 |
| **EBITDA** | -$174,300 | $512,000 | $3,018,000 |
| **EBITDA Margin** | -97% | 30% | 50% |

---

## Tab 5: Break-even Analysis

### Break-even Calculation

| Scenario | Monthly Fixed Costs | Avg Revenue/User | Break-even Users | Timeline |
|----------|---------------------|------------------|------------------|----------|
| **Conservative** | $25,000 | $11 | 2,273 paying | Month 22 |
| **Moderate** | $30,000 | $12 | 2,500 paying | Month 16 |
| **Aggressive** | $35,000 | $13 | 2,692 paying | Month 12 |

### Monthly Break-even Chart Data

| Month | Revenue | Costs | Cumulative P/L | Status |
|-------|---------|-------|----------------|--------|
| 6 | $8,000 | $28,000 | -$120,000 | Below |
| 12 | $25,000 | $32,000 | -$200,000 | Below |
| 16 | $50,000 | $45,000 | -$180,000 | **Break-even** |
| 18 | $70,000 | $55,000 | -$150,000 | Above |
| 24 | $150,000 | $90,000 | +$100,000 | Profitable |

### Cash Flow to Break-even

| Period | Revenue | Expenses | Net Cash | Cumulative |
|--------|---------|----------|----------|------------|
| Months 1-6 | $45,000 | $175,000 | -$130,000 | -$130,000 |
| Months 7-12 | $135,000 | $195,000 | -$60,000 | -$190,000 |
| Months 13-16 | $180,000 | $180,000 | $0 | -$190,000 |
| Months 17-24 | $600,000 | $480,000 | +$120,000 | -$70,000 |
| Months 25-36 | $4,500,000 | $2,150,000 | +$2,350,000 | +$2,280,000 |

---

## Tab 6: Sensitivity Analysis

### Revenue Sensitivity

#### Conversion Rate Impact (Y3 Revenue)

| Premium Conversion | 4% | 5% | 6% | 7% | 8% |
|--------------------|-----|-----|-----|-----|-----|
| **Revenue** | $4.2M | $5.2M | $6.1M | $7.1M | $8.0M |
| **Change** | -31% | -15% | Baseline | +16% | +31% |

#### Pricing Impact (Y3 Revenue @ 6% conversion)

| Premium Price | $7.99 | $8.99 | $9.99 | $11.99 | $14.99 |
|---------------|-------|-------|-------|--------|--------|
| **Revenue** | $4.9M | $5.5M | $6.1M | $7.3M | $9.1M |
| **Change** | -20% | -10% | Baseline | +20% | +49% |

#### Churn Impact (Y3 Revenue)

| Monthly Churn | 3% | 4% | 5% | 6% | 7% |
|---------------|-----|-----|-----|-----|-----|
| **Revenue** | $7.0M | $6.5M | $6.1M | $5.7M | $5.3M |
| **Change** | +15% | +7% | Baseline | -7% | -13% |

### Cost Sensitivity

#### CAC Impact on Profitability

| CAC | $10 | $15 | $20 | $25 | $30 |
|-----|------|------|------|------|------|
| **Y3 EBITDA** | $3.5M | $3.0M | $2.5M | $2.0M | $1.5M |
| **Break-even** | Mo 12 | Mo 16 | Mo 20 | Mo 24 | Mo 28 |

#### Team Size Impact

| Team Size (Y2) | 3 FTEs | 4 FTEs | 5 FTEs | 6 FTEs |
|----------------|--------|--------|--------|--------|
| **Personnel Cost** | $400K | $550K | $700K | $850K |
| **Y2 EBITDA** | $700K | $512K | $350K | $200K |

### Scenario Summary

| Scenario | Y1 Revenue | Y3 Revenue | Y3 EBITDA | Break-even |
|----------|------------|------------|-----------|------------|
| **Conservative** | $120K | $2.5M | $500K | Month 22 |
| **Moderate** | $180K | $6.1M | $3.0M | Month 16 |
| **Aggressive** | $300K | $12.0M | $7.0M | Month 12 |

---

## Tab 7: Unit Economics

### Customer Lifetime Value (LTV)

| Tier | Monthly Price | Avg Tenure | Gross LTV | Net LTV (after churn) |
|------|---------------|------------|-----------|----------------------|
| **Premium** | $9.99 | 14 months | $140 | $120 |
| **Pro** | $19.99 | 18 months | $360 | $320 |
| **Blended** | $12.50 | 15 months | $188 | $160 |

### Customer Acquisition Cost (CAC)

| Channel | CAC | % of Budget | Weighted CAC |
|---------|-----|-------------|--------------|
| Organic/SEO | $5 | 30% | $1.50 |
| Content Marketing | $10 | 20% | $2.00 |
| Paid Social | $20 | 25% | $5.00 |
| Paid Search | $25 | 15% | $3.75 |
| Influencers | $18 | 10% | $1.80 |
| **Blended CAC** | | 100% | **$14.05** |

### LTV:CAC Analysis

| Metric | Premium | Pro | Blended |
|--------|---------|-----|---------|
| **LTV** | $120 | $320 | $160 |
| **CAC** | $14 | $14 | $14 |
| **LTV:CAC** | 8.6x | 22.9x | **11.4x** |
| **Payback (months)** | 1.4 | 0.7 | **1.1** |

### Unit Economics by Year

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| **CAC** | $18 | $14 | $12 |
| **LTV** | $100 | $150 | $180 |
| **LTV:CAC** | 5.6x | 10.7x | 15x |
| **Payback** | 1.8 mo | 1.2 mo | 0.8 mo |

---

## Tab 8: Funding & Runway

### Funding Ask

| Round | Amount | Use of Funds |
|-------|--------|--------------|
| **Seed** | $500,000 | 18-month runway to break-even |

### Use of Funds Breakdown

| Category | Amount | % | Purpose |
|----------|--------|---|---------|
| **Engineering** | $200,000 | 40% | 2 additional engineers (12 mo) |
| **Marketing** | $150,000 | 30% | User acquisition, content, brand |
| **Infrastructure** | $50,000 | 10% | Hosting, APIs, tools |
| **Operations** | $50,000 | 10% | Legal, accounting, office |
| **Buffer** | $50,000 | 10% | Contingency |

### Runway Analysis

| Scenario | Monthly Burn | Runway (with $500K) | Break-even |
|----------|--------------|---------------------|------------|
| **Conservative** | $35,000 | 14 months | Month 22 (needs bridge) |
| **Moderate** | $30,000 | 17 months | Month 16 ✅ |
| **Aggressive** | $25,000 | 20 months | Month 12 ✅ |

### Funding Milestones

| Milestone | Target | Timeline |
|-----------|--------|----------|
| Seed Close | $500K | Month 0 |
| 10,000 Users | Acquisition | Month 6 |
| 1,000 Paying Users | Monetization | Month 9 |
| $25K MRR | Traction | Month 12 |
| Break-even | Sustainability | Month 16 |
| Series A Readiness | Growth metrics | Month 18 |

### Valuation Scenarios

| Scenario | Y3 Revenue | Multiple | Valuation |
|----------|------------|----------|-----------|
| **Conservative** | $2.5M | 8x | $20M |
| **Moderate** | $6.1M | 10x | $61M |
| **Aggressive** | $12M | 12x | $144M |

### Investor Returns (20% equity for $500K)

| Scenario | Valuation | Investor Stake | Return |
|----------|-----------|----------------|--------|
| **Conservative** | $20M | $4M | 8x |
| **Moderate** | $61M | $12.2M | 24x |
| **Aggressive** | $144M | $28.8M | 58x |

---

## Key Financial Metrics Summary

### Year 1 Targets

| Metric | Target |
|--------|--------|
| Users | 50,000 |
| Paying Users | 2,500 (5%) |
| MRR (End of Year) | $25,000 |
| ARR | $180,000 |
| Burn Rate | $30,000/mo |
| Runway | 17 months |

### Year 3 Targets (Moderate)

| Metric | Target |
|--------|--------|
| Users | 600,000 |
| Paying Users | 51,000 (8.5%) |
| MRR | $540,000 |
| ARR | $6,480,000 |
| Gross Margin | 85% |
| EBITDA Margin | 50% |
| LTV:CAC | 15x |

---

## Spreadsheet Implementation Notes

### Formulas Required

```
Cell References:
- User Growth: =PREVIOUS_MONTH * (1 + GROWTH_RATE)
- Premium Users: =TOTAL_USERS * PREMIUM_CONVERSION
- MRR: =PREMIUM_USERS * PREMIUM_PRICE + PRO_USERS * PRO_PRICE
- ARPU: =TOTAL_MRR / PAYING_USERS
- LTV: =ARPU / CHURN_RATE
- CAC: =MARKETING_SPEND / NEW_PAYING_USERS
- Gross Profit: =REVENUE - COGS
- EBITDA: =GROSS_PROFIT - OPEX
```

### Scenario Toggles

```
Dropdown selectors for:
- Scenario (Conservative/Moderate/Aggressive)
- Pricing ($7.99/$9.99/$11.99)
- Team Size (3/4/5/6 FTEs)
- Marketing Budget (Low/Medium/High)
```

### Charts to Include

1. **Revenue Growth** - Line chart, 3 scenarios
2. **User Growth** - Area chart with Free/Premium/Pro stacks
3. **MRR Waterfall** - New, expansion, contraction, churn
4. **Break-even** - Revenue vs costs over time
5. **Unit Economics** - LTV:CAC by year
6. **Cash Position** - Runway visualization

---

*Document prepared for Crypture investor materials - Phase 2*  
*Spreadsheet: financial-model.xlsx to be created from this specification*
