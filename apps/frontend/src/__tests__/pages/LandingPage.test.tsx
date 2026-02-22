import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import LandingPage from '@pages/LandingPage';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

// Mock child components
vi.mock('@components/Layout/LandingLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('@components/Layout/FeatureCard', () => ({
  default: ({ title, description }: { title: string; description: string }) => (
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  ),
}));

vi.mock('@components/Layout/HowItWorksStep', () => ({
  default: ({ title, description }: { title: string; description: string }) => (
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  ),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('LandingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Hero Section CTAs', () => {
    it('should render primary "Get Started Free" button linking to /register', () => {
      renderWithRouter(<LandingPage />);

      const getStartedButton = screen.getByRole('link', {
        name: /get started free/i,
      });
      expect(getStartedButton).toBeInTheDocument();
      expect(getStartedButton).toHaveAttribute('href', '/register');
    });

    it('should render secondary "View Demo" button linking to /portfolio', () => {
      renderWithRouter(<LandingPage />);

      const viewDemoButton = screen.getByRole('link', { name: /view demo/i });
      expect(viewDemoButton).toBeInTheDocument();
      expect(viewDemoButton).toHaveAttribute('href', '/portfolio');
    });

    it('should render tertiary "Learn More" button linking to features', () => {
      renderWithRouter(<LandingPage />);

      const learnMoreButton = screen.getByRole('link', { name: /learn more/i });
      expect(learnMoreButton).toBeInTheDocument();
      expect(learnMoreButton).toHaveAttribute('href', '#features');
    });

    it('should have correct button hierarchy with primary styling', () => {
      renderWithRouter(<LandingPage />);

      const getStartedButton = screen.getByRole('link', {
        name: /get started free/i,
      });
      expect(getStartedButton).toHaveClass('bg-indigo-600', 'text-white');
    });

    it('should have correct secondary button styling', () => {
      renderWithRouter(<LandingPage />);

      const viewDemoButton = screen.getByRole('link', { name: /view demo/i });
      expect(viewDemoButton).toHaveClass('bg-indigo-100', 'text-indigo-700');
    });
  });

  describe('How It Works Section CTA', () => {
    it('should render secondary "Get Started for Free" button linking to /register', () => {
      renderWithRouter(<LandingPage />);

      const getStartedButtons = screen.getAllByRole('link', {
        name: /get started for free/i,
      });
      expect(getStartedButtons).toHaveLength(1);
      expect(getStartedButtons[0]).toHaveAttribute('href', '/register');
    });

    it('should have gradient styling for How It Works CTA', () => {
      renderWithRouter(<LandingPage />);

      const getStartedButtons = screen.getAllByRole('link', {
        name: /get started for free/i,
      });
      expect(getStartedButtons[0]).toHaveClass(
        'bg-gradient-to-r',
        'from-indigo-600',
        'to-teal-500'
      );
    });
  });

  describe('Route Consistency', () => {
    it('should use /register route consistently for all registration CTAs', () => {
      renderWithRouter(<LandingPage />);

      const registerLinks = screen.getAllByRole('link', {
        name: /get started/i,
      });
      registerLinks.forEach((link) => {
        expect(link).toHaveAttribute('href', '/register');
      });
    });

    it('should not have any /signup routes', () => {
      renderWithRouter(<LandingPage />);

      const allLinks = screen.getAllByRole('link');
      const signupLinks = allLinks.filter((link) =>
        link.getAttribute('href')?.includes('/signup')
      );
      expect(signupLinks).toHaveLength(0);
    });
  });

  describe('Accessibility', () => {
    it('should have proper button semantics', () => {
      renderWithRouter(<LandingPage />);

      const getStartedButton = screen.getByRole('link', {
        name: /get started free/i,
      });
      expect(getStartedButton).toBeInTheDocument();
    });

    it('should have descriptive link text', () => {
      renderWithRouter(<LandingPage />);

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link).toHaveAccessibleName();
      });
    });

    it('should have proper heading hierarchy', () => {
      renderWithRouter(<LandingPage />);

      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);

      // Check for main heading
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();
    });
  });

  describe('Content Rendering', () => {
    it('should render main heading', () => {
      renderWithRouter(<LandingPage />);

      const mainHeading = screen.getByText(/track your crypto/i);
      expect(mainHeading).toBeInTheDocument();
    });

    it('should render features section', () => {
      renderWithRouter(<LandingPage />);

      const featuresHeading = screen.getByText(
        /everything you need to track your crypto/i
      );
      expect(featuresHeading).toBeInTheDocument();
    });

    it('should render how it works section', () => {
      renderWithRouter(<LandingPage />);

      const howItWorksHeading = screen.getByText(/how it works/i);
      expect(howItWorksHeading).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive button classes', () => {
      renderWithRouter(<LandingPage />);

      const primaryButton = screen.getByRole('link', {
        name: /get started free/i,
      });
      expect(primaryButton).toHaveClass('md:py-4', 'md:text-lg', 'md:px-10');
    });

    it('should have responsive layout classes', () => {
      renderWithRouter(<LandingPage />);

      const buttonContainer = screen.getByRole('link', {
        name: /get started free/i,
      }).parentElement;
      expect(buttonContainer).toHaveClass('flex-col', 'sm:flex-row');
    });
  });
});
