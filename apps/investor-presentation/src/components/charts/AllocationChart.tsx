interface AllocationChartProps {
  data: { label: string; value: number }[];
}

export function AllocationChart({ data }: AllocationChartProps) {
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
    </div>
  );
}
