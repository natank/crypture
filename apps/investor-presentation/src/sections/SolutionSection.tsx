import { SectionWrapper } from '../components/SectionWrapper';
import { solutionContent } from '../data/presentationContent';

export function SolutionSection() {
  return (
    <SectionWrapper
      id="solution"
      eyebrow={solutionContent.eyebrow}
      title={solutionContent.title}
      tone="light"
    >
      <div className="two-column">
        <div>
          <p className="section__lead">{solutionContent.lead}</p>
          <ul className="bullet-list">
            {solutionContent.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
        <div className="highlight-card">
          <p className="label">Outcome</p>
          <p>{solutionContent.highlight}</p>
        </div>
      </div>
    </SectionWrapper>
  );
}
