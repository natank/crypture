import type { ReactNode } from 'react';

interface SectionWrapperProps {
  id: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  tone?: 'dark' | 'light';
}

export function SectionWrapper({ id, eyebrow, title, children, tone = 'dark' }: SectionWrapperProps) {
  return (
    <section id={id} className={`section section--${tone}`}>
      <div className="section__content">
        {eyebrow && <p className="section__eyebrow">{eyebrow}</p>}
        <h2 className="section__title">{title}</h2>
        <div className="section__body">{children}</div>
      </div>
    </section>
  );
}
