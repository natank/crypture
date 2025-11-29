# Preliminary Design Report

## Backlog Item
- **ID**: 24
- **Title**: Price Alerts & Notifications
- **Requirement**: [REQ-013-notifications](../../../requirements/REQ-013-notifications.md)

---

## 1. UX/UI Design

### 1.1 Alert Access Point
The alerts feature is accessed via a **bell icon button** in the `PortfolioHeader` navigation area.

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Crypture    Portfolio | Market    🔔(2)   Total: $XX,XXX │
│                                           ↑                     │
│                                    Alert button with badge      │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Alerts Panel (Slide-out)
Clicking the bell icon opens a slide-out panel from the right side.

```
┌────────────────────────────────────────┬──────────────────────────┐
│                                        │ ╔════════════════════════╗│
│                                        │ ║ 🔔 Price Alerts        ║│
│       Portfolio View                   │ ╠════════════════════════╣│
│       (dimmed when panel open)         │ ║ [+ Create Alert]       ║│
│                                        │ ╠────────────────────────╣│
│                                        │ ║ Active Alerts (2)      ║│
│                                        │ ║ ┌──────────────────┐   ║│
│                                        │ ║ │ BTC > $100,000   │   ║│
│                                        │ ║ │ 🟢 Active  [⋮]   │   ║│
│                                        │ ║ └──────────────────┘   ║│
│                                        │ ║ ┌──────────────────┐   ║│
│                                        │ ║ │ ETH < $2,500     │   ║│
│                                        │ ║ │ 🟢 Active  [⋮]   │   ║│
│                                        │ ║ └──────────────────┘   ║│
│                                        │ ╠────────────────────────╣│
│                                        │ ║ Triggered (1)          ║│
│                                        │ ║ ┌──────────────────┐   ║│
│                                        │ ║ │ SOL > $150 ✓     │   ║│
│                                        │ ║ │ Triggered 2h ago │   ║│
│                                        │ ║ └──────────────────┘   ║│
│                                        │ ╚════════════════════════╝│
└────────────────────────────────────────┴──────────────────────────┘
```

### 1.3 Create Alert Form (Modal)
Clicking "Create Alert" opens a modal with the alert configuration form.

```
┌────────────────────────────────────────┐
│            Create Price Alert          │
├────────────────────────────────────────┤
│                                        │
│  Asset                                 │
│  ┌────────────────────────────────┐    │
│  │ 🔍 Search or select asset...   │    │
│  └────────────────────────────────┘    │
│                                        │
│  Condition                             │
│  ┌──────────────┐ ┌──────────────┐     │
│  │ (•) Above    │ │ ( ) Below    │     │
│  └──────────────┘ └──────────────┘     │
│                                        │
│  Target Price                          │
│  ┌────────────────────────────────┐    │
│  │ $                              │    │
│  └────────────────────────────────┘    │
│  Current price: $98,500                │
│                                        │
│  ┌────────────────────────────────┐    │
│  │        Create Alert            │    │
│  └────────────────────────────────┘    │
│                                        │
└────────────────────────────────────────┘
```

### 1.4 Notification Permission Flow
First-time alert creation triggers a permission request:

```
┌────────────────────────────────────────┐
│   🔔 Enable Notifications?             │
├────────────────────────────────────────┤
│                                        │
│   Get notified when your price alerts  │
│   are triggered, even when you're not  │
│   actively looking at the app.         │
│                                        │
│   ┌──────────────┐ ┌──────────────┐    │
│   │   Not Now    │ │    Enable    │    │
│   └──────────────┘ └──────────────┘    │
│                                        │
│   You can change this later in         │
│   your browser settings.               │
│                                        │
└────────────────────────────────────────┘
```

### 1.5 In-App Notification Banner
When an alert triggers, a banner appears at the top:

```
┌─────────────────────────────────────────────────────────────────┐
│ 🔔 Alert Triggered: BTC is now above $100,000!  [View] [✕]     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Technical Approach

### 2.1 Data Model

```typescript
// frontend/src/types/alert.ts

export type AlertCondition = 'above' | 'below';
export type AlertStatus = 'active' | 'triggered' | 'muted';

export interface PriceAlert {
  id: string;                    // UUID
  coinId: string;                // CoinGecko coin ID
  coinSymbol: string;            // Display symbol (BTC, ETH)
  coinName: string;              // Full name (Bitcoin, Ethereum)
  condition: AlertCondition;     // 'above' or 'below'
  targetPrice: number;           // Target price in USD
  status: AlertStatus;           // Current alert status
  createdAt: number;             // Timestamp
  triggeredAt?: number;          // When alert fired (if triggered)
}

export interface AlertsState {
  alerts: PriceAlert[];
  notificationsEnabled: boolean;
  notificationPermission: NotificationPermission; // 'granted' | 'denied' | 'default'
}
```

### 2.2 localStorage Schema

```typescript
const ALERTS_STORAGE_KEY = 'crypture_alerts';

// Stored structure
interface StoredAlerts {
  alerts: PriceAlert[];
  notificationsEnabled: boolean;
  lastChecked: number;
}
```

### 2.3 Alert Checking Logic

```typescript
function checkAlertCondition(alert: PriceAlert, currentPrice: number): boolean {
  if (alert.status !== 'active') return false;
  
  if (alert.condition === 'above') {
    return currentPrice >= alert.targetPrice;
  } else {
    return currentPrice <= alert.targetPrice;
  }
}
```

---

## 3. Component Architecture

### 3.1 New Components

| Component | Purpose | Location |
|-----------|---------|----------|
| `AlertsPanel` | Slide-out panel containing alert list and actions | `components/AlertsPanel/` |
| `AlertForm` | Modal form for creating/editing alerts | `components/AlertForm/` |
| `AlertList` | List of alerts grouped by status | `components/AlertList/` |
| `AlertItem` | Single alert row with actions | `components/AlertItem/` |
| `NotificationBanner` | In-app notification for triggered alerts | `components/NotificationBanner/` |
| `NotificationPermission` | Permission request dialog | `components/NotificationPermission/` |

### 3.2 Component Hierarchy

```
PortfolioHeader
└── AlertButton (with badge)
    └── AlertsPanel (slide-out)
        ├── AlertList (active)
        │   └── AlertItem[]
        ├── AlertList (triggered)
        │   └── AlertItem[]
        └── AlertForm (modal, on create/edit)

App (root)
└── NotificationBanner (portal to top of viewport)
└── NotificationPermission (modal, first-time only)
```

### 3.3 Services

| Service | Purpose |
|---------|---------|
| `alertService.ts` | CRUD operations, localStorage persistence |
| `notificationService.ts` | Web Notifications API wrapper, permission handling |

### 3.4 Hooks

| Hook | Purpose |
|------|---------|
| `useAlerts` | Alert state management, CRUD operations |
| `useAlertPolling` | Periodic alert condition checking |
| `useNotifications` | Notification permission and sending |

---

## 4. Data Flow

```
                    ┌─────────────────┐
                    │   User Action   │
                    │ (Create Alert)  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   AlertForm     │
                    │   Component     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  alertService   │
                    │   .create()     │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
     ┌─────────────────┐           ┌─────────────────┐
     │  localStorage   │           │  useAlerts      │
     │   (persist)     │           │  (state update) │
     └─────────────────┘           └────────┬────────┘
                                            │
                                            ▼
                                   ┌─────────────────┐
                                   │  AlertsPanel    │
                                   │  (re-render)    │
                                   └─────────────────┘


                    ┌─────────────────┐
                    │  Polling Timer  │
                    │  (5-15 min)     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ useAlertPolling │
                    │ (check alerts)  │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
     ┌─────────────────┐           ┌─────────────────┐
     │ Current Prices  │           │  Active Alerts  │
     │ (from cache)    │           │  (from state)   │
     └────────┬────────┘           └────────┬────────┘
              │                             │
              └──────────────┬──────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Alert Triggered │
                    │      Yes?       │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
     ┌─────────────────┐           ┌─────────────────┐
     │ Browser Notif   │           │ In-App Banner   │
     │ (if permitted)  │           │ (always)        │
     └─────────────────┘           └─────────────────┘
```

---

## 5. Integration Points

### 5.1 Existing Components Modified

| Component | Change |
|-----------|--------|
| `PortfolioHeader` | Add AlertButton with badge |
| `App.tsx` | Add NotificationBanner portal |

### 5.2 Existing Services Used

| Service | Usage |
|---------|-------|
| `coinService.ts` | Get current prices for alert checking |
| React Query cache | Leverage cached market data |

---

## 6. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Notification permission denied | Always show in-app banner as fallback |
| Alert checking when tab inactive | Use `visibilitychange` to pause/resume polling |
| Too many notifications | Implement "triggered" status to prevent re-firing |
| localStorage quota exceeded | Limit max alerts (e.g., 50) |
| Stale prices | Use React Query's `staleTime` and `refetchInterval` |

---

## 7. Accessibility Considerations

- Alert button has `aria-label` with count of active alerts
- AlertsPanel is a `role="dialog"` with focus trap
- NotificationBanner uses `role="alert"` for screen reader announcement
- All interactive elements have visible focus states
- Color is not the only indicator of alert status (use icons/text)

---

## 8. Testing Strategy

### Unit Tests
- `alertService.ts`: CRUD operations, localStorage persistence
- `notificationService.ts`: Permission handling, notification sending
- `AlertForm`: Validation, form submission
- `AlertList`: Rendering, grouping by status
- `useAlertPolling`: Timer behavior, condition checking

### E2E Tests
- Create a price alert flow
- View and delete alert flow
- Alert triggering (with mocked prices)
- Notification permission flow

---

## 9. Estimated Effort

| Component | Hours |
|-----------|-------|
| Types & alertService | 1 |
| AlertForm | 2 |
| AlertsPanel & AlertList | 2 |
| PortfolioHeader integration | 0.5 |
| notificationService | 1 |
| useAlertPolling hook | 1.5 |
| NotificationBanner | 1 |
| Unit tests | 2 |
| E2E tests | 1.5 |
| **Total** | **~12.5 hours** |
