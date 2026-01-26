import { SectionWrapper } from '../components/SectionWrapper';
import { problemContent } from '../data/presentationContent';

export function ProblemSection() {
  return (
    <SectionWrapper
      id="problem"
      eyebrow={problemContent.eyebrow}
      title={problemContent.title}
    >
      <p className="section__lead">{problemContent.lead}</p>
      <div className="card-grid">
        {problemContent.cards.map((card) => (
          <div key={card} className="card">
            {card}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
