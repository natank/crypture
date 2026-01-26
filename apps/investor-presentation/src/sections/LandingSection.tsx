import { SectionWrapper } from '../components/SectionWrapper';
import { landingContent } from '../data/presentationContent';

export function LandingSection() {
  return (
    <SectionWrapper
      id="landing"
      eyebrow={landingContent.eyebrow}
      title={landingContent.title}
      tone="dark"
    >
      <p className="section__lead">{landingContent.lead}</p>
      <div className="pill-grid">
        {landingContent.highlights.map((highlight) => (
          <span key={highlight}>{highlight}</span>
        ))}
      </div>
      <div className="cta-row">
        <a className="cta-primary" href="#team">
          Start Presentation
        </a>
        <a className="cta-secondary" href="#market">
          Skip to Key Numbers
        </a>
      </div>
    </SectionWrapper>
  );
}
