import { SectionWrapper } from '../components/SectionWrapper';
import { nextStepsContent } from '../data/presentationContent';

export function NextStepsSection() {
  return (
    <SectionWrapper
      id="next-steps"
      eyebrow={nextStepsContent.eyebrow}
      title={nextStepsContent.title}
      tone="light"
    >
      <p className="section__lead">{nextStepsContent.lead}</p>
      <div className="cta-row">
        <a className="cta-primary" href="mailto:founder@crypture.app">
          {nextStepsContent.ctaPrimary}
        </a>
        <a className="cta-secondary" href="#landing">
          {nextStepsContent.ctaSecondary}
        </a>
      </div>
    </SectionWrapper>
  );
}
