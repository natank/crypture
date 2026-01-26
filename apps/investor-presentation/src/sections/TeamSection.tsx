import { SectionWrapper } from '../components/SectionWrapper';
import { teamContent } from '../data/presentationContent';

export function TeamSection() {
  return (
    <SectionWrapper
      id="team"
      eyebrow={teamContent.eyebrow}
      title={teamContent.title}
      tone="light"
    >
      <div className="two-column">
        <div>
          <p className="section__lead">{teamContent.lead}</p>
          <ul className="bullet-list">
            {teamContent.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
        <div className="highlight-card">
          <p className="label">Why this team wins</p>
          <p>{teamContent.highlight}</p>
        </div>
      </div>
    </SectionWrapper>
  );
}
