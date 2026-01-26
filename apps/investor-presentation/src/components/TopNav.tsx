import type { PresentationSection } from '../data/sections';

interface TopNavProps {
  sections: PresentationSection[];
}

export function TopNav({ sections }: TopNavProps) {
  return (
    <header className="top-nav">
      <div className="top-nav__brand">
        <img
          src="/logo/svg/crypture-logo-negative-space.svg"
          alt="Crypture"
          className="top-nav__logo"
        />
        <span className="top-nav__name">Investor Presentation</span>
      </div>
      <nav className="top-nav__links" aria-label="Presentation sections">
        {sections.map((section) => (
          <a key={section.id} href={`#${section.id}`} className="top-nav__link">
            {section.label}
          </a>
        ))}
      </nav>
      <a className="top-nav__cta" href="#next-steps">
        Contact
      </a>
    </header>
  );
}
