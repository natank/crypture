import { AllocationItem } from '@services/portfolioAnalyticsService';

interface AllocationLegendProps {
  data: AllocationItem[];
}

export default function AllocationLegend({ data }: AllocationLegendProps) {
  if (data.length === 0) return null;

  return (
    <div
      data-testid="allocation-legend"
      className="flex flex-col gap-3 h-full"
      aria-label="Allocation breakdown"
    >
      <h3 className="text-lg font-semibold text-text mb-2">Breakdown</h3>
      <div className="flex flex-col gap-2 overflow-y-auto max-h-64 md:max-h-80 lg:max-h-96">
        {data.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2 rounded hover:bg-surface-soft transition-colors"
          >
            <div className="flex items-center gap-2 flex-1">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-text truncate">
                {item.name}
              </span>
            </div>
            <div className="flex flex-col items-end ml-2">
              <span className="text-sm font-semibold text-text">
                {item.percentage.toFixed(1)}%
              </span>
              <span className="text-xs text-text-muted">
                $
                {item.value.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
