interface AllocationChartProps {
  data: { label: string; value: number }[];
}

export function AllocationChart({ data }: AllocationChartProps) {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  return (
    <div className="chart card">
      <p className="label">Use of funds allocation</p>
      <div className="allocation">
        {data.map((entry) => (
          <div key={entry.label} className="allocation__row">
            <span>{entry.label}</span>
            <div className="allocation__bar">
              <span style={{ width: `${entry.value}%` }} />
            </div>
            <strong>{entry.value}%</strong>
          </div>
        ))}
      </div>
      <div className="chart__legend">
        {data.map((entry) => (
          <div key={entry.label} className="chart__legend-item">
            <span className="chart__dot" />
            <span>
              {entry.label}: {entry.value}%
            </span>
          </div>
        ))}
        <p className="chart__note">Allocation totals {total}% of seed round.</p>
      </div>
    </div>
  );
}
