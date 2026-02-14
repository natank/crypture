import { useEffect, useRef } from 'react';
import { Rocket, Sparkles, ArrowRight } from 'lucide-react';

type DemoPortfolioModalProps = {
  onAccept: () => void;
  onDismiss: () => void;
};

export default function DemoPortfolioModal({
  onAccept,
  onDismiss,
}: DemoPortfolioModalProps) {
  const acceptRef = useRef<HTMLButtonElement>(null);

  // Focus the primary CTA on mount
  useEffect(() => {
    acceptRef.current?.focus();
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onDismiss]);

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onDismiss();
      }}
    >
      <div className="modal-content card flex flex-col items-center gap-6 sm:gap-8 p-6 sm:p-10 max-w-md w-full text-center">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-brand-primary/10">
          <Rocket
            className="w-7 h-7 text-brand-primary"
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-col gap-2">
          <h2
            id="demo-modal-title"
            className="text-2xl sm:text-3xl font-bold text-text"
          >
            Welcome to Crypture!
          </h2>
          <p className="text-base text-text-muted text-balance">
            Track your crypto portfolio in real time with live prices, charts,
            and insights.
          </p>
        </div>

        <p className="text-sm text-text-muted text-balance">
          Want to explore with a sample portfolio? We'll add a few popular coins
          so you can see how everything works.
        </p>

        <div className="flex flex-col gap-3 w-full">
          <button
            ref={acceptRef}
            onClick={onAccept}
            className="btn bg-brand-primary hover:bg-brand-primary/90 focus-visible:ring-brand-primary flex items-center justify-center gap-2 w-full"
            data-testid="accept-demo-portfolio"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Add Demo Portfolio
          </button>
          <button
            onClick={onDismiss}
            className="btn btn-outline flex items-center justify-center gap-2 w-full"
            data-testid="dismiss-demo-portfolio"
          >
            Start from Scratch
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
