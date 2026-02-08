import { SectionWrapper } from '../components/SectionWrapper';
import { askContent } from '../data/presentationContent';
import { AllocationChart } from '../components/charts/AllocationChart';

export function AskSection() {
  return (
    <SectionWrapper
      id="ask"
      eyebrow={askContent.eyebrow}
      title={askContent.title}
      tone="light"
    >
      <div className="metric-row">
        {askContent.metrics.map((metric) => (
          <div key={metric.label} className="metric-card">
            <p className="metric">{metric.value}</p>
            <p className="label">{metric.label}</p>
          </div>
        ))}
      </div>
      <div className="two-column">
        <AllocationChart data={askContent.allocation} />
        <div className="card">
          <p className="label">12-month milestones</p>
          <ul className="bullet-list">
            {askContent.milestones.map((milestone) => (
              <li key={milestone}>{milestone}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="section__note">{askContent.note}</p>
    </SectionWrapper>
  );
}
