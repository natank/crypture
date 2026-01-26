interface ComparisonRow {
  feature: string;
  crypture: boolean;
  coinstats: boolean;
  cointracker: boolean;
  delta: boolean;
}

interface ComparisonTableProps {
  rows: ComparisonRow[];
}

const check = (value: boolean) => (value ? '✓' : '—');

export function ComparisonTable({ rows }: ComparisonTableProps) {
  return (
    <div className="comparison card">
      <div className="comparison__header">
        <span>Feature</span>
        <span>Crypture</span>
        <span>CoinStats</span>
        <span>CoinTracker</span>
        <span>Delta</span>
      </div>
      {rows.map((row) => (
        <div key={row.feature} className="comparison__row">
          <span>{row.feature}</span>
          <span className="comparison__highlight">{check(row.crypture)}</span>
          <span>{check(row.coinstats)}</span>
          <span>{check(row.cointracker)}</span>
          <span>{check(row.delta)}</span>
        </div>
      ))}
    </div>
  );
}
