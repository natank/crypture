import { SectionWrapper } from '../components/SectionWrapper';
import { marketContent } from '../data/presentationContent';
import { MarketSizingChart } from '../components/charts/MarketSizingChart';

export function MarketSection() {
  return (
    <SectionWrapper
      id="market"
      eyebrow={marketContent.eyebrow}
      title={marketContent.title}
    >
      <div className="metric-row">
        {marketContent.metrics.map((metric) => (
          <div key={metric.label} className="metric-card">
            <p className="metric">{metric.value}</p>
            <p className="label">{metric.label}</p>
          </div>
        ))}
      </div>
      <div className="two-column">
        <MarketSizingChart data={marketContent.sizing} />
        <div className="card">
          <p className="label">Growth drivers</p>
          <ul className="bullet-list">
            {marketContent.drivers.map((driver) => (
              <li key={driver}>{driver}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="section__note">{marketContent.note}</p>
    </SectionWrapper>
  );
}
