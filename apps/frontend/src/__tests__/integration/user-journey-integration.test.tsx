import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import LandingPage from '@pages/LandingPage';
import RegisterPage from '@pages/RegisterPage';

// Mock the registration components
vi.mock('@components/auth/RegisterForm', () => ({
  RegisterForm: ({ onSubmit, isLoading, error }: any) => (
    <div>
      <h1>Create your account</h1>
      <button
        onClick={() =>
          onSubmit({
            email: 'test@example.com',
            password: 'password123',
            confirmPassword: 'password123',
          })
        }
        disabled={isLoading}
      >
        {isLoading ? 'Creating...' : 'Create Account'}
      </button>
      {error && <div role="alert">{error}</div>}
    </div>
  ),
}));

vi.mock('@components/auth/EmailVerification', () => ({
  EmailVerification: ({ email, onVerify, onResend, isLoading, error }: any) => (
    <div>
      <h1>Verify your email</h1>
      <p>Check {email} for verification code</p>
      <button onClick={() => onVerify('123456', email)} disabled={isLoading}>
        {isLoading ? 'Verifying...' : 'Verify'}
      </button>
      <button onClick={() => onResend(email)} disabled={isLoading}>
        Resend
      </button>
      {error && <div role="alert">{error}</div>}
    </div>
  ),
}));

vi.mock('@hooks/useRegistration', () => ({
  useRegistration: () => ({
    step: 'form',
    isLoading: false,
    error: null,
    registeredEmail: null,
    register: vi.fn(),
    verifyEmail: vi.fn(),
    resendVerification: vi.fn(),
  }),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

// Mock layout components
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

const renderWithRoutes = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/portfolio" element={<div>Portfolio Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('User Journey Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Landing Page to Registration Journey', () => {
    it('should navigate from landing page to registration when clicking primary CTA', async () => {
      renderWithRoutes('/');

      // Verify we're on landing page
      expect(screen.getByText(/track your crypto/i)).toBeInTheDocument();

      // Click primary "Get Started Free" button
      const getStartedButton = screen.getByRole('link', {
        name: /get started free/i,
      });
      expect(getStartedButton).toHaveAttribute('href', '/register');

      fireEvent.click(getStartedButton);

      // Should navigate to registration page
      await waitFor(() => {
        expect(screen.getByText(/create your account/i)).toBeInTheDocument();
      });
    });

    it('should navigate from landing page to registration when clicking secondary CTA', async () => {
      renderWithRoutes('/');

      // Click secondary "Get Started for Free" button in How It Works
      const getStartedButtons = screen.getAllByRole('link', {
        name: /get started for free/i,
      });
      const secondaryButton = getStartedButtons.find((btn) =>
        btn.closest('.bg-gradient-to-r')
      );

      expect(secondaryButton).toHaveAttribute('href', '/register');

      fireEvent.click(secondaryButton!);

      // Should navigate to registration page
      await waitFor(() => {
        expect(screen.getByText(/create your account/i)).toBeInTheDocument();
      });
    });

    it('should navigate to portfolio when clicking View Demo', async () => {
      renderWithRoutes('/');

      // Click "View Demo" button
      const viewDemoButton = screen.getByRole('link', { name: /view demo/i });
      expect(viewDemoButton).toHaveAttribute('href', '/portfolio');

      fireEvent.click(viewDemoButton);

      // Should navigate to portfolio page
      await waitFor(() => {
        expect(screen.getByText(/portfolio page/i)).toBeInTheDocument();
      });
    });

    it('should scroll to features when clicking Learn More', () => {
      renderWithRoutes('/');

      // Mock scrollIntoView
      const mockScrollIntoView = vi.fn();
      window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

      // Click "Learn More" button
      const learnMoreButton = screen.getByRole('link', { name: /learn more/i });
      expect(learnMoreButton).toHaveAttribute('href', '#features');

      fireEvent.click(learnMoreButton);

      // Should attempt to scroll to features section
      expect(mockScrollIntoView).toHaveBeenCalled();
    });
  });

  describe('Route Consistency Validation', () => {
    it('should maintain consistent /register route throughout the journey', () => {
      renderWithRoutes('/');

      // All registration links should use /register
      const registerLinks = screen.getAllByRole('link', {
        name: /get started/i,
      });
      registerLinks.forEach((link) => {
        expect(link.getAttribute('href')).toBe('/register');
      });

      // No /signup routes should exist
      const allLinks = screen.getAllByRole('link');
      const signupLinks = allLinks.filter((link) =>
        link.getAttribute('href')?.includes('/signup')
      );
      expect(signupLinks).toHaveLength(0);
    });
  });

  describe('Button Hierarchy Validation', () => {
    it('should maintain correct button styling hierarchy', () => {
      renderWithRoutes('/');

      // Primary button should have primary styling
      const primaryButton = screen.getByRole('link', {
        name: /get started free/i,
      });
      expect(primaryButton).toHaveClass('bg-indigo-600', 'text-white');

      // Secondary button should have secondary styling
      const secondaryButton = screen.getByRole('link', { name: /view demo/i });
      expect(secondaryButton).toHaveClass('bg-indigo-100', 'text-indigo-700');

      // Tertiary button should have tertiary styling
      const tertiaryButton = screen.getByRole('link', { name: /learn more/i });
      expect(tertiaryButton).toHaveClass('bg-indigo-100', 'text-indigo-700');
    });

    it('should have gradient styling for How It Works CTA', () => {
      renderWithRoutes('/');

      const getStartedButtons = screen.getAllByRole('link', {
        name: /get started for free/i,
      });
      const gradientButton = getStartedButtons.find((btn) =>
        btn.closest('.bg-gradient-to-r')
      );

      expect(gradientButton).toHaveClass(
        'bg-gradient-to-r',
        'from-indigo-600',
        'to-teal-500'
      );
    });
  });

  describe('User Journey Entry Points', () => {
    it('should provide multiple entry points to registration', () => {
      renderWithRoutes('/');

      // Should have primary entry point in hero section
      const primaryButton = screen.getByRole('link', {
        name: /get started free/i,
      });
      expect(primaryButton).toBeInTheDocument();

      // Should have secondary entry point in How It Works section
      const secondaryButtons = screen.getAllByRole('link', {
        name: /get started for free/i,
      });
      expect(secondaryButtons.length).toBeGreaterThan(0);

      // All should point to /register
      secondaryButtons.forEach((button) => {
        expect(button.getAttribute('href')).toBe('/register');
      });
    });
  });

  describe('Accessibility Integration', () => {
    it('should maintain accessibility throughout the journey', () => {
      renderWithRoutes('/');

      // All interactive elements should be accessible
      const interactiveElements = screen.getAllByRole('link');
      interactiveElements.forEach((element) => {
        expect(element).toHaveAccessibleName();
      });

      // Should have proper heading structure
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);

      // Main heading should be present
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();
    });
  });

  describe('Responsive Design Integration', () => {
    it('should maintain responsive behavior', () => {
      renderWithRoutes('/');

      // Buttons should have responsive classes
      const primaryButton = screen.getByRole('link', {
        name: /get started free/i,
      });
      expect(primaryButton).toHaveClass('md:py-4', 'md:text-lg', 'md:px-10');

      // Layout should be responsive
      const buttonContainer = primaryButton.parentElement;
      expect(buttonContainer).toHaveClass('flex-col', 'sm:flex-row');
    });
  });
});
