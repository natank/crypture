import { AIShowcasePanel } from '../components/AIShowcasePanel';
import { SectionWrapper } from '../components/SectionWrapper';
import { aiAdvantageContent } from '../data/presentationContent';

export function AIAdvantageSection() {
  return (
    <SectionWrapper
      id="ai-advantage"
      eyebrow={aiAdvantageContent.eyebrow}
      title={aiAdvantageContent.title}
    >
      <div className="two-column">
        <div>
          <div className="card">
            <p className="label">Velocity</p>
            <p>{aiAdvantageContent.velocity}</p>
          </div>
          <div className="card" style={{ marginTop: '16px' }}>
            <p className="label">Quality</p>
            <p>{aiAdvantageContent.quality}</p>
          </div>
        </div>
        <AIShowcasePanel
          metrics={aiAdvantageContent.metrics}
          comparisons={aiAdvantageContent.comparisons}
        />
      </div>
      <p className="section__note">{aiAdvantageContent.note}</p>
    </SectionWrapper>
  );
}
