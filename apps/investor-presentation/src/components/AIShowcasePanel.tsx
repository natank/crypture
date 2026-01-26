interface AIShowcasePanelProps {
  metrics: { label: string; value: string }[];
  comparisons: { label: string; value: string }[];
}

export function AIShowcasePanel({ metrics, comparisons }: AIShowcasePanelProps) {
  return (
    <div className="ai-panel card">
      <p className="label">Execution advantage</p>
      <div className="ai-panel__metrics">
        {metrics.map((metric) => (
          <div key={metric.label} className="ai-panel__metric">
            <p className="metric">{metric.value}</p>
            <p className="label">{metric.label}</p>
          </div>
        ))}
      </div>
      <div className="ai-panel__comparison">
        {comparisons.map((item) => (
          <div key={item.label}>
            <p className="label">{item.label}</p>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
