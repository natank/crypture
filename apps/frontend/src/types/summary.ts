/**
 * Types for Daily Portfolio Summary
 * Backlog Item 25 - REQ-013-notifications
 */

export interface AssetPerformance {
  coinId: string;
  coinSymbol: string;
  coinName: string;
  change24hPercent: number;
  currentValue: number;
}

export type NotableEventType =
  | 'alert_triggered'
  | 'significant_move'
  | 'price_milestone';

export interface NotableEvent {
  id: string;
  type: NotableEventType;
  message: string;
  timestamp: number;
  coinId?: string;
  coinSymbol?: string;
}

export interface DailySummary {
  portfolioValue: number;
  change24h: {
    absolute: number;
    percentage: number;
  };
  topPerformers: AssetPerformance[];
  worstPerformers: AssetPerformance[];
  notableEvents: NotableEvent[];
  asOfTime: number;
  isEmpty: boolean;
}

export const EMPTY_SUMMARY: DailySummary = {
  portfolioValue: 0,
  change24h: { absolute: 0, percentage: 0 },
  topPerformers: [],
  worstPerformers: [],
  notableEvents: [],
  asOfTime: Date.now(),
  isEmpty: true,
};
