import React from 'react';
import { formatPercentage } from '../../utils/formatters';
import { HelpIcon } from '@components/EducationalTooltip';
import type { TooltipKey } from '@components/EducationalTooltip';

interface MarketMetricCardProps {
    label: string;
    value: string;
    change?: number;
    isLoading?: boolean;
    testId?: string;
    tooltipKey?: TooltipKey;
}

export const MarketMetricCard: React.FC<MarketMetricCardProps> = ({
    label,
    value,
    change,
    isLoading = false,
    testId,
    tooltipKey,
}) => {
    if (isLoading) {
        return (
            <div
                className="bg-white rounded-lg shadow-md p-6 animate-pulse"
                data-testid={testId ? `${testId}-skeleton` : 'metric-skeleton'}
            >
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
        );
    }

    const isPositive = change !== undefined && change > 0;
    const isNegative = change !== undefined && change < 0;

    const changeColor = isPositive
        ? 'text-green-600'
        : isNegative
            ? 'text-red-600'
            : 'text-gray-500';

    const changeIcon = isPositive ? '↑' : isNegative ? '↓' : '';

    return (
        <div
            className="bg-white rounded-lg shadow-md p-6 flex flex-col"
            data-testid={testId}
        >
            <h3 className="text-gray-500 text-sm font-medium mb-1 flex items-center gap-1">
                {label}
                {tooltipKey && <HelpIcon contentKey={tooltipKey} />}
            </h3>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900" data-testid="metric-value">
                    {value}
                </span>
                {change !== undefined && (
                    <span
                        className={`text-sm font-medium flex items-center ${changeColor}`}
                        data-testid="metric-change"
                    >
                        {changeIcon} {formatPercentage(Math.abs(change))}
                    </span>
                )}
            </div>
        </div>
    );
};
