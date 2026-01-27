import type { ReactNode } from 'react';

interface MarketSizingChartProps {
  data: { label: string; value: number; note: string }[];
  unit?: ReactNode;
}

export function MarketSizingChart({
  data,
  unit = 'B',
}: MarketSizingChartProps) {
  const maxValue = Math.max(...data.map((entry) => entry.value));

  return (
    <div className="chart card">
      <p className="label">Market sizing (TAM / SAM / SOM)</p>
      <div className="chart__bars">
        {data.map((entry) => (
          <div key={entry.label} className="chart__row">
            <div className="chart__label">
              <span>{entry.label}</span>
              <strong>
                {entry.value.toFixed(2)}
                {unit}
              </strong>
            </div>
            <div className="chart__bar">
              <span style={{ width: `${(entry.value / maxValue) * 100}%` }} />
            </div>
            <p className="chart__note">{entry.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
