/**
 * Alert types for Price Alerts & Notifications feature
 * REQ-013-notifications / Backlog Item 24
 */

export type AlertCondition = 'above' | 'below';
export type AlertStatus = 'active' | 'triggered' | 'muted';

export interface PriceAlert {
  id: string;
  coinId: string;
  coinSymbol: string;
  coinName: string;
  coinImage?: string;
  condition: AlertCondition;
  targetPrice: number;
  status: AlertStatus;
  createdAt: number;
  triggeredAt?: number;
}

export interface CreateAlertInput {
  coinId: string;
  coinSymbol: string;
  coinName: string;
  coinImage?: string;
  condition: AlertCondition;
  targetPrice: number;
}

export interface UpdateAlertInput {
  condition?: AlertCondition;
  targetPrice?: number;
  status?: AlertStatus;
}
