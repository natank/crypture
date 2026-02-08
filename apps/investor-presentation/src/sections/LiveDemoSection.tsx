import { DemoEmbed } from '../components/DemoEmbed';
import { DemoSteps } from '../components/DemoSteps';
import { SectionWrapper } from '../components/SectionWrapper';
import { liveDemoContent } from '../data/presentationContent';

export function LiveDemoSection() {
  return (
    <SectionWrapper
      id="live-demo"
      eyebrow={liveDemoContent.eyebrow}
      title={liveDemoContent.title}
    >
      <div className="two-column">
        <div>
          <DemoEmbed
            src={liveDemoContent.demoUrl}
            origin={liveDemoContent.demoOrigin}
          />
          <div className="pill-grid">
            {liveDemoContent.highlights.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        <DemoSteps steps={liveDemoContent.steps} />
      </div>
    </SectionWrapper>
  );
}
