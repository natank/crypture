export default function AppFooter() {
  return (
    <footer className="text-center text-sm text-gray-500 border-t border-gray-200 py-4 mt-12">
      <p>
        Crypture • Clarity for every coin ·{' '}
        <a href="/about" className="hover:text-brand-accent">
          About
        </a>{' '}
        ·{' '}
        <a href="/privacy" className="hover:text-brand-accent">
          Privacy
        </a>{' '}
        ·{' '}
        <a href="/contact" className="hover:text-brand-accent">
          Contact
        </a>
      </p>
    </footer>
  );
}
