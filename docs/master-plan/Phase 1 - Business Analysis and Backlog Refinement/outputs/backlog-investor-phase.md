# Investor Phase Backlog

**Document:** Phase 1 Output - Hybrid Master Plan  
**Version:** 1.0  
**Date:** January 2025

---

## Executive Summary

This document refines Crypture's product backlog for investor presentation purposes. It identifies which existing features best demonstrate value to investors and proposes new user stories aligned with monetization strategy. Features are categorized by their investor appeal, target segment alignment, and monetization tier mapping.

---

## Current Feature Inventory

### Delivered Features Summary (27+ Items)

| Category | Count | Status |
|----------|-------|--------|
| Core Portfolio Management | 4 | ✅ All Complete |
| Real-Time Data Integration | 2 | ✅ All Complete |
| UI and Usability | 8 | ✅ All Complete |
| Extended Features | 5 | ✅ 4 Complete, 1 Pending (Auth) |
| Technical Debt | 4 | ✅ All Complete |
| Market Intelligence | 3 | ✅ All Complete |
| Advanced Analytics | 3 | ✅ All Complete |
| User Engagement | 2 | ✅ All Complete |
| Investment Research | 3 | ✅ All Complete |

---

## Investor-Ready Feature Categories

### Category A: Core Value Demonstration

These features demonstrate the fundamental value proposition and must be highlighted in any investor presentation.

| ID | Feature | Investor Appeal | Segment | Demo Priority |
|----|---------|-----------------|---------|---------------|
| 1 | Add Crypto Asset with Quantity | Core functionality proof | All | **High** |
| 3 | Calculate and Display Total Portfolio Value | Real-time value tracking | All | **High** |
| 4 | Fetch Real-Time Prices via CoinGecko API | Data reliability | All | **High** |
| 9 | Persist Portfolio in Local Storage | Privacy differentiator | Privacy | **Critical** |
| 10/11 | Export/Import Portfolio (CSV/JSON) | Data portability | Privacy/Power | **High** |

### Category B: User Experience Excellence

These features demonstrate product polish and user-centric design, crucial for investor confidence.

| ID | Feature | Investor Appeal | Segment | Demo Priority |
|----|---------|-----------------|---------|---------------|
| 14 | Landing Page with Navigation | First impression, brand | All | **Critical** |
| UI-14 | Branded Visual Identity | Professional appearance | All | **High** |
| 6 | Filter/Sort Assets | Usability depth | Power | **Medium** |
| 7 | Handle UI States (Loading, Error) | Product maturity | All | **Medium** |
| 17 | Improve Asset Addition Feedback | UX polish | Beginner | **Medium** |

### Category C: Competitive Differentiation

These features demonstrate unique value propositions that differentiate Crypture from competitors.

| ID | Feature | Investor Appeal | Segment | Demo Priority |
|----|---------|-----------------|---------|---------------|
| 18 | Market Overview Dashboard | Market intelligence | Power | **High** |
| 19 | Trending & Discovery Feed | Discovery value | All | **High** |
| 24 | Price Alerts & Notifications | User engagement | Power | **Critical** |
| 22 | Portfolio Performance Tracking | Analytics depth | Power | **High** |
| 21 | Portfolio Composition Visualizations | Visual appeal | All | **High** |

### Category D: Premium Value Demonstration

These features demonstrate monetization potential and premium tier justification.

| ID | Feature | Investor Appeal | Segment | Demo Priority |
|----|---------|-----------------|---------|---------------|
| 23 | Asset-Level Insights & Metrics | AI-driven analytics | Power | **High** |
| 25 | Daily Portfolio Summary & Insights | Engagement loop | All | **High** |
| 26 | Coin Deep Dive Pages | Research depth | Power | **Medium** |
| 27 | Compare Coins Side-by-Side | Decision support | Power | **Medium** |
| 28 | Educational Tooltips | Beginner value | Beginner | **Medium** |

---

## 10 Recommended Demo Screens

Based on investor appeal, segment coverage, and visual impact, the following 10 screens should be prioritized for investor presentation:

### Screen Selection with Rationale

| # | Screen | Primary Story | Segments | Tier | Visual Impact | Rationale |
|---|--------|---------------|----------|------|---------------|-----------|
| 1 | **Landing Page** | Brand introduction | All | Free | ⭐⭐⭐⭐⭐ | First impression, establishes brand credibility |
| 2 | **Portfolio Dashboard** | Core tracking | All | Free | ⭐⭐⭐⭐⭐ | Heart of product, shows real-time value |
| 3 | **Add Asset Flow** | Ease of use | Beginner | Free | ⭐⭐⭐⭐ | Demonstrates no-login simplicity |
| 4 | **Portfolio Composition** | Visual analytics | All | Free | ⭐⭐⭐⭐⭐ | High visual appeal, pie/donut charts |
| 5 | **Performance Tracking** | P&L visibility | Power | Premium | ⭐⭐⭐⭐⭐ | Shows monetization potential |
| 6 | **Market Overview** | Market intelligence | Power | Free | ⭐⭐⭐⭐ | Demonstrates data breadth |
| 7 | **Trending/Discovery** | Discovery value | All | Free | ⭐⭐⭐⭐ | Engagement and growth features |
| 8 | **Price Alerts** | Engagement | Power | Premium | ⭐⭐⭐⭐ | Clear premium feature value |
| 9 | **Asset Insights** | AI analytics | Power | Pro | ⭐⭐⭐⭐⭐ | AI differentiator, premium justification |
| 10 | **Export/Import** | Privacy & portability | Privacy | Free | ⭐⭐⭐ | Privacy differentiator proof |

### Screen-to-User Story Mapping

| Screen | Primary User Story | Acceptance Criteria Highlight |
|--------|-------------------|-------------------------------|
| Landing Page | "As a visitor, I want to understand what Crypture offers so I can decide to try it" | Clear value prop, CTA, brand consistency |
| Portfolio Dashboard | "As a user, I want to see my total portfolio value at a glance" | Real-time prices, total value, asset list |
| Add Asset Flow | "As a user, I want to easily add assets without creating an account" | No login, search coins, confirm add |
| Portfolio Composition | "As a user, I want to visualize my portfolio allocation" | Pie chart, percentages, interactive |
| Performance Tracking | "As a user, I want to track gains/losses over time" | P&L charts, time ranges, percentage change |
| Market Overview | "As a user, I want to see the overall crypto market status" | Market cap, volume, top gainers/losers |
| Trending/Discovery | "As a user, I want to discover trending and new coins" | Trending list, categories, quick add |
| Price Alerts | "As a user, I want to be notified when prices hit my targets" | Set alert, notification, manage alerts |
| Asset Insights | "As a user, I want AI-driven insights about my assets" | Metrics, recommendations, risk indicators |
| Export/Import | "As a privacy-conscious user, I want to export my data" | CSV/JSON download, import restore |

---

## Proposed New User Stories (Monetization Aligned)

The following 5 new user stories are proposed to strengthen monetization potential and investor appeal.

### Story M-01: Premium Tier Upgrade Flow

**Priority:** High  
**Category:** Monetization  
**Target Segments:** All

> As a Free user who has reached feature limits, I want a clear and compelling upgrade path so that I can access premium features without friction.

**Acceptance Criteria:**
- [ ] Clear feature comparison between Free/Premium/Pro tiers
- [ ] Seamless upgrade flow (Stripe integration ready)
- [ ] 7-day free trial option for Premium
- [ ] Upgrade prompts appear contextually when hitting limits
- [ ] Success confirmation and immediate feature access

**Investor Value:** Demonstrates monetization infrastructure and conversion optimization.

---

### Story M-02: Portfolio Sharing (Read-Only Link)

**Priority:** Medium  
**Category:** Growth/Viral  
**Target Segments:** Power Users, Beginners

> As a user, I want to generate a read-only link to share my portfolio with others so that I can showcase my holdings or get feedback.

**Acceptance Criteria:**
- [ ] Generate unique shareable link
- [ ] Link shows portfolio composition (no sensitive data)
- [ ] Viewer sees "Create your own" CTA
- [ ] Link expiration options (1 day, 7 days, permanent)
- [ ] Revoke link capability

**Investor Value:** Demonstrates viral growth mechanism and user acquisition strategy.

---

### Story M-03: Smart Portfolio Alerts (AI-Powered)

**Priority:** High  
**Category:** Premium Feature  
**Target Segments:** Power Users

> As a Pro user, I want AI-generated alerts about portfolio opportunities and risks so that I can make timely decisions without constant monitoring.

**Acceptance Criteria:**
- [ ] AI analyzes portfolio composition and market conditions
- [ ] Generates contextual alerts (rebalancing, concentration risk, opportunities)
- [ ] User controls alert frequency (real-time, daily digest, weekly)
- [ ] Alerts include actionable insights, not just data
- [ ] Pro tier exclusive feature

**Investor Value:** Validates AI differentiation and Pro tier premium pricing.

---

### Story M-04: Multi-Portfolio Support

**Priority:** Medium  
**Category:** Premium Feature  
**Target Segments:** Power Users, Privacy-Conscious

> As a Premium user, I want to manage multiple portfolios so that I can track different strategies or accounts separately.

**Acceptance Criteria:**
- [ ] Create up to 5 portfolios (Premium) or 10 portfolios (Pro)
- [ ] Switch between portfolios easily
- [ ] Each portfolio has independent settings
- [ ] Aggregate view across all portfolios available
- [ ] Import/export per portfolio

**Investor Value:** Natural upsell driver from Free tier.

---

### Story M-05: Watchlist with Smart Tracking

**Priority:** Medium  
**Category:** Engagement  
**Target Segments:** All

> As a user, I want to create a watchlist of coins I'm interested in so that I can track potential investments before buying.

**Acceptance Criteria:**
- [ ] Add coins to watchlist without adding to portfolio
- [ ] Watchlist shows real-time prices and 24h change
- [ ] Quick-add to portfolio from watchlist
- [ ] Price alerts available for watchlist items (Premium)
- [ ] Trending coins can be added to watchlist directly

**Investor Value:** Increases session time and engagement metrics.

---

## Feature-to-Monetization Tier Mapping

### Free Tier Features

| Feature | Purpose |
|---------|---------|
| Portfolio tracking (1 portfolio, 20 assets max) | Core value, low barrier |
| Real-time prices | Essential functionality |
| Basic portfolio composition chart | Visual appeal |
| Market overview | Discovery and engagement |
| Trending coins | User acquisition hook |
| Export/Import CSV | Privacy differentiator |
| Educational tooltips | Beginner support |

### Premium Tier ($9.99/mo)

| Feature | Upgrade Trigger |
|---------|-----------------|
| Unlimited assets | Portfolio growth |
| Multi-portfolio (up to 5) | Strategy separation |
| Price alerts (up to 20) | Active trading needs |
| Performance tracking (90 days) | P&L visibility |
| Advanced composition charts | Analytics depth |
| Watchlist with alerts | Investment research |
| Priority data refresh | Real-time accuracy |

### Pro Tier ($19.99/mo)

| Feature | Upgrade Trigger |
|---------|-----------------|
| Everything in Premium | — |
| Multi-portfolio (up to 10) | Complex portfolios |
| Unlimited price alerts | Active management |
| Performance tracking (1 year+) | Long-term analysis |
| AI-powered insights | Intelligent analytics |
| Smart portfolio alerts | Proactive recommendations |
| Asset comparison tools | Decision support |
| API access (future) | Custom integrations |
| Priority support | Enterprise needs |

---

## Investor Presentation Feature Narrative

### The Story Arc

1. **Problem** (Slide 1-2)
   - "Crypto investors struggle with fragmented tracking and privacy concerns"
   - Reference CoinStats breach, Blockfolio collapse

2. **Solution** (Slide 3-4)
   - "Crypture: Privacy-first portfolio tracking with AI insights"
   - Demo: Landing Page → Add Asset (no login)

3. **Product Demo** (Slides 5-10)
   - Portfolio Dashboard (real-time value)
   - Portfolio Composition (visual appeal)
   - Performance Tracking (P&L proof)
   - Market Overview (data breadth)
   - Price Alerts (engagement)
   - Asset Insights (AI differentiation)

4. **Monetization** (Slide 11-12)
   - Free → Premium → Pro tier progression
   - Feature gating demonstration
   - Conversion trigger points

5. **Traction & Metrics** (Slide 13)
   - 27+ features delivered
   - MVP deployed at foliocrypto.netlify.app
   - Target: [X] users in first 6 months

---

## Backlog Prioritization for Investor Phase

### Must Demonstrate (P0)

| Feature | Status | Action |
|---------|--------|--------|
| Landing Page | ✅ Complete | Polish for screenshots |
| Portfolio Dashboard | ✅ Complete | Polish for screenshots |
| Portfolio Composition | ✅ Complete | Verify visual appeal |
| Price Alerts | ✅ Complete | Ensure notification demo works |
| Export/Import | ✅ Complete | Verify flow for demo |

### Should Demonstrate (P1)

| Feature | Status | Action |
|---------|--------|--------|
| Performance Tracking | ✅ Complete | Add sample data for demo |
| Market Overview | ✅ Complete | Verify data freshness |
| Trending/Discovery | ✅ Complete | Verify compelling content |
| Asset Insights | ✅ Complete | Polish AI recommendations UI |
| Add Asset Flow | ✅ Complete | Ensure smooth flow |

### Nice to Demonstrate (P2)

| Feature | Status | Action |
|---------|--------|--------|
| Coin Deep Dive | ✅ Complete | Secondary demo if time |
| Compare Coins | ✅ Complete | Secondary demo if time |
| Daily Summary | ✅ Complete | Show engagement value |
| Educational Tooltips | ✅ Complete | Beginner segment proof |

### Defer for Post-Investment (P3)

| Feature | Status | Rationale |
|---------|--------|-----------|
| User Authentication | 🔄 Pending | Optional, not core value prop |
| Demo Feature | 🔄 Pending | Process validation only |

---

## Success Metrics for Investor Demo

| Metric | Target | Measurement |
|--------|--------|-------------|
| Demo duration | 5-7 minutes | Timed walkthrough |
| Screens covered | 10 screens | Checklist |
| Questions addressed | 80%+ common questions | Post-demo feedback |
| Value prop clarity | "Privacy-first AI tracker" recalled | Investor feedback |
| Next steps requested | Meeting scheduled | Conversion |

---

*Document prepared for Crypture investor materials - Phase 1*
