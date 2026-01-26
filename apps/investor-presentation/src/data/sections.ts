import type { ComponentType } from 'react';
import { LandingSection } from '../sections/LandingSection';
import { TeamSection } from '../sections/TeamSection';
import { ProblemSection } from '../sections/ProblemSection';
import { SolutionSection } from '../sections/SolutionSection';
import { MarketSection } from '../sections/MarketSection';
import { BusinessModelSection } from '../sections/BusinessModelSection';
import { CompetitionSection } from '../sections/CompetitionSection';
import { LiveDemoSection } from '../sections/LiveDemoSection';
import { AskSection } from '../sections/AskSection';
import { AIAdvantageSection } from '../sections/AIAdvantageSection';
import { NextStepsSection } from '../sections/NextStepsSection';

export interface PresentationSection {
  id: string;
  label: string;
  Component: ComponentType;
}

export const presentationSections: PresentationSection[] = [
  { id: 'landing', label: 'Start', Component: LandingSection },
  { id: 'team', label: 'Team', Component: TeamSection },
  { id: 'problem', label: 'Problem', Component: ProblemSection },
  { id: 'solution', label: 'Solution', Component: SolutionSection },
  { id: 'market', label: 'Market', Component: MarketSection },
  { id: 'business-model', label: 'Business', Component: BusinessModelSection },
  { id: 'competition', label: 'Competition', Component: CompetitionSection },
  { id: 'live-demo', label: 'Demo', Component: LiveDemoSection },
  { id: 'ask', label: 'The Ask', Component: AskSection },
  { id: 'ai-advantage', label: 'AI Advantage', Component: AIAdvantageSection },
  { id: 'next-steps', label: 'Next Steps', Component: NextStepsSection }
];
