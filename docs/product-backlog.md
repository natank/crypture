## 📋 Product Backlog

This document outlines the prioritized list of user stories for the Crypto Portfolio Tracker application. It serves as the single source of truth for all planned features and enhancements, structured to deliver maximum user value while supporting an agile, iterative development approach.

The backlog is derived from the product vision and software development plan, focusing first on core functionality essential to the Minimum Viable Product (MVP). Each user story is written from the perspective of our target users, with clearly defined acceptance criteria to guide implementation and validation.

Stories are grouped by feature category and prioritized based on their importance to user experience, technical dependencies, and overall product goals. This backlog will evolve with ongoing feedback, development progress, and product insights.

---

## 🗂 Summary of Backlog Items

| ID | Title | Priority | Feature Category | Status | Related Requirement |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Add Crypto Asset with Quantity | High | Core Portfolio Management | ✅ Done | [REQ-001-core-portfolio](requirements/REQ-001-core-portfolio.md) |
| 2 | Delete Crypto Asset | High | Core Portfolio Management | ✅ Done | [REQ-001-core-portfolio](requirements/REQ-001-core-portfolio.md) |
| 3 | Calculate and Display Total Portfolio Value | High | Core Portfolio Management | ✅ Done | [REQ-001-core-portfolio](requirements/REQ-001-core-portfolio.md) |
| 4 | Fetch Real-Time Prices via CoinGecko API | High | Real-Time Data Integration | ✅ Done | [REQ-002-real-time-data](requirements/REQ-002-real-time-data.md) |
| 5 | Real-Time Value Updates on Change | High | Real-Time Data Integration | ✅ Done | [REQ-002-real-time-data](requirements/REQ-002-real-time-data.md) |
| 0 | Render Portfolio Overview Layout | High | UI and Usability | ✅ Done | [REQ-003-ui-usability](requirements/REQ-003-ui-usability.md) |
| 6 | Filter/Sort Assets by Name or Value | High | UI and Usability | ✅ Done | [REQ-003-ui-usability](requirements/REQ-003-ui-usability.md) |
| 7 | Handle UI States (Loading, Error) | Medium | UI and Usability | ✅ Done | [REQ-003-ui-usability](requirements/REQ-003-ui-usability.md) |
| 8 | Intuitive Interface for Non-Technical Users | Medium | UI and Usability | ✅ Done | [REQ-003-ui-usability](requirements/REQ-003-ui-usability.md) |
| UI-14 | Establish Branded Visual Identity Across App | Medium | UI and Usability | ✅ Done | [REQ-004-branding](requirements/REQ-004-branding.md) |
| UI-15 | Align Component Styles with Updated UI Mockups | High | UI and Usability | ✅ Done | [REQ-004-branding](requirements/REQ-004-branding.md) |
| UI-16 | Improve Header & Toolbar Layout | Medium | UI and Usability | ✅ Done | [REQ-004-branding](requirements/REQ-004-branding.md) |
| 9 | Persist Portfolio in Local Storage/Backend | High | Extended Features | ✅ Done | [REQ-005-persistence](requirements/REQ-005-persistence.md) |
| 10 | Export Portfolio to CSV/JSON | High | Extended Features | ✅ Done | [REQ-006-import-export](requirements/REQ-006-import-export.md) |
| 11 | Import Portfolio from CSV/JSON | High | Extended Features | ✅ Done | [REQ-006-import-export](requirements/REQ-006-import-export.md) |
| 12 | Add Charting for Price History | Low | Extended Features | ✅ Done | [REQ-007-charting](requirements/REQ-007-charting.md) |
| 13 | Enable User Authentication | Low | Extended Features | 🔄 Pending | [REQ-008-auth](requirements/REQ-008-auth.md) |
| 16 | Edit Asset Quantity | High | Core Portfolio Management | ✅ Done | [REQ-001-core-portfolio](requirements/REQ-001-core-portfolio.md) |
| 17 | Improve Asset Addition Feedback & Visibility | Medium | UI and Usability | ✅ Done | [REQ-009-feedback](requirements/REQ-009-feedback.md) |
| 14 | Add Landing Page with Navigation to Portfolio | High | UI and Usability | ✅ Done | [REQ-003-ui-usability](requirements/REQ-003-ui-usability.md) |
| 15 | Refactor Sprint 1 Code to Follow SOLID Principles | Medium | Technical Debt | ✅ Done | [REQ-010-tech-debt](requirements/REQ-010-tech-debt.md) |
| TD-02 | UI Visibility Refactor and Design Token Integration | Medium | Technical Debt | ✅ Done | [REQ-010-tech-debt](requirements/REQ-010-tech-debt.md) |
| TD-03 | Windsurf-Aided Review of UI/UX Design Docs | Medium | Technical Debt | ✅ Done | [REQ-010-tech-debt](requirements/REQ-010-tech-debt.md) |
| TD-04 | Visual/UX Refactor of `ui-mockups.md` for Design System Alignment | Medium | Technical Debt | ✅ Done | [REQ-010-tech-debt](requirements/REQ-010-tech-debt.md) |
| 999 | Demo Feature for Process Validation | Low | Demo | 🔄 Pending | [REQ-999-demo-feature](requirements/REQ-999-demo-feature.md) |

---

## 🚀 Post-MVP Features

| ID | Title | Priority | Feature Category | Status | Related Requirement |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 18 | Market Overview Dashboard | High | Market Intelligence | ✅ Done | [REQ-011-market-intel](requirements/REQ-011-market-intel.md) <br> [Story](stories/STORY-018-market-overview.md) |
| 19 | Trending & Discovery Feed | High | Market Intelligence | ✅ Done | [REQ-011-market-intel](requirements/REQ-011-market-intel.md) <br> [Story](stories/STORY-019-trending-discovery.md) |
| 20 | Category-Based Exploration | Medium | Market Intelligence | ✅ Done | [REQ-011-market-intel](requirements/REQ-011-market-intel.md) <br> [Story](stories/STORY-020-category-exploration.md) |
| 21 | Portfolio Composition Visualizations | High | Advanced Analytics | ✅ Done | [REQ-012-analytics](requirements/REQ-012-analytics.md) |
| 22 | Portfolio Performance Tracking | High | Advanced Analytics | ✅ Done | [REQ-022-portfolio-performance](requirements/REQ-022-portfolio-performance.md) <br> [Story](stories/STORY-022-portfolio-performance.md) |
| 23 | Asset-Level Insights & Metrics | Medium | Advanced Analytics | 🔄 Pending | [REQ-012-analytics](requirements/REQ-012-analytics.md) |
| 24 | Price Alerts & Notifications | High | User Engagement | 🔄 Pending | [REQ-013-notifications](requirements/REQ-013-notifications.md) |
| 25 | Daily Portfolio Summary & Insights | Medium | User Engagement | 🔄 Pending | [REQ-013-notifications](requirements/REQ-013-notifications.md) |
| 26 | Coin Deep Dive Pages | Medium | Investment Research | 🔄 Pending | [REQ-014-research](requirements/REQ-014-research.md) |
| 27 | Compare Coins Side-by-Side | Low | Investment Research | 🔄 Pending | [REQ-014-research](requirements/REQ-014-research.md) |
| 28 | Educational Tooltips & Contextual Help | Medium | Investment Research | 🔄 Pending | [REQ-014-research](requirements/REQ-014-research.md) |

> **Note:** For detailed strategic context and phasing recommendations, see [`post-mvp-strategy.md`](../post-mvp-strategy.md) in the artifacts directory.

---