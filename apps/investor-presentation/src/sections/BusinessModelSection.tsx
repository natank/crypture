import { PricingCards } from '../components/PricingCards';
import { SectionWrapper } from '../components/SectionWrapper';
import { businessModelContent } from '../data/presentationContent';

export function BusinessModelSection() {
  return (
    <SectionWrapper
      id="business-model"
      eyebrow={businessModelContent.eyebrow}
      title={businessModelContent.title}
    >
      <PricingCards tiers={businessModelContent.tiers} />
      <div className="two-column">
        <div className="card">
          <p className="label">Unit economics</p>
          <div className="metric-row">
            {businessModelContent.unitEconomics.map((metric) => (
              <div key={metric.label}>
                <p className="metric">{metric.value}</p>
                <p className="label">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <p className="label">Core assumptions</p>
          <ul className="bullet-list">
            {businessModelContent.assumptions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="section__note">{businessModelContent.note}</p>
    </SectionWrapper>
  );
}
