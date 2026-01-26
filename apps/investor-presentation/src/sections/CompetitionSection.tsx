import { ComparisonTable } from '../components/ComparisonTable';
import { SectionWrapper } from '../components/SectionWrapper';
import { competitionContent } from '../data/presentationContent';

export function CompetitionSection() {
  return (
    <SectionWrapper
      id="competition"
      eyebrow={competitionContent.eyebrow}
      title={competitionContent.title}
      tone="light"
    >
      <div className="two-column">
        <div className="card">
          <p className="label">Incumbents</p>
          <p>{competitionContent.incumbents}</p>
        </div>
        <div className="card">
          <p className="label">Crypture</p>
          <p>{competitionContent.crypture}</p>
        </div>
      </div>
      <ComparisonTable rows={competitionContent.comparison} />
      <p className="section__note">{competitionContent.note}</p>
    </SectionWrapper>
  );
}
