import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ScrollRestoration } from '@components/ScrollRestoration';

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

// Mock window.scrollTo
const mockScrollTo = vi.fn();
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
});

// Mock JSDOM navigation to prevent "Not implemented" errors
Object.defineProperty(window, 'location', {
  value: {
    pathname: '/portfolio',
    href: 'http://localhost/portfolio',
  },
  writable: true,
});

// Mock window.navigation to prevent JSDOM errors
Object.defineProperty(window, 'navigation', {
  value: {
    navigate: vi.fn(),
  },
  writable: true,
});

// Mock HTMLAnchorElement.prototype.click to prevent navigation
const originalClick = HTMLAnchorElement.prototype.click;
HTMLAnchorElement.prototype.click = function () {
  // Prevent actual navigation but still trigger click events
  this.dispatchEvent(new MouseEvent('click', { bubbles: true }));
};

// Mock navigateFetch to prevent JSDOM navigation errors
const originalNavigateFetch = globalThis.navigateFetch;
globalThis.navigateFetch = vi.fn(() => Promise.resolve());

// Mock window.scrollY
let mockScrollY = 0;
Object.defineProperty(window, 'scrollY', {
  get: () => mockScrollY,
  configurable: true,
});

describe('ScrollRestoration', () => {
  beforeEach(() => {
    mockSessionStorage.clear();
    mockScrollTo.mockClear();
    mockScrollY = 0;
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    // Restore original mocks
    HTMLAnchorElement.prototype.click = originalClick;
    globalThis.navigateFetch = originalNavigateFetch;
  });

  const renderWithRouter = (initialPath: string = '/portfolio') => {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <ScrollRestoration />
      </MemoryRouter>
    );
  };

  describe('Scroll Position Restoration', () => {
    it('restores saved scroll position on popstate (back/forward navigation)', () => {
      mockSessionStorage.setItem('scroll_/portfolio', '500');

      // Update mocked pathname for this test
      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/portfolio',
          href: 'http://localhost/portfolio',
        },
        writable: true,
      });

      renderWithRouter('/portfolio');

      // Simulate browser back/forward navigation
      window.dispatchEvent(new PopStateEvent('popstate', { state: null }));

      // Wait for the setTimeout in popstate handler
      vi.advanceTimersByTime(10);

      // Run the restore retries
      vi.runAllTimers();

      expect(mockScrollTo).toHaveBeenCalledWith(0, 500);
    });

    it('scrolls to top when no saved position exists on popstate', () => {
      // Update mocked pathname for this test
      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/portfolio',
          href: 'http://localhost/portfolio',
        },
        writable: true,
      });

      renderWithRouter('/portfolio');

      // Simulate browser back/forward navigation
      window.dispatchEvent(new PopStateEvent('popstate', { state: null }));

      // Wait for the setTimeout in popstate handler
      vi.advanceTimersByTime(10);

      // Run the restore retries
      vi.runAllTimers();

      expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
    });

    it('uses route-specific storage keys on popstate', () => {
      mockSessionStorage.setItem('scroll_/coin/bitcoin', '300');

      renderWithRouter('/coin/bitcoin');

      // Update mocked pathname for this test
      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/coin/bitcoin',
          href: 'http://localhost/coin/bitcoin',
        },
        writable: true,
      });

      // Simulate browser back/forward navigation
      window.dispatchEvent(new PopStateEvent('popstate', { state: null }));

      // Wait for the setTimeout in popstate handler
      vi.advanceTimersByTime(10);

      // Run the restore retries
      vi.runAllTimers();

      expect(mockScrollTo).toHaveBeenCalledWith(0, 300);
    });

    it('does not restore scroll on initial mount', () => {
      mockSessionStorage.setItem('scroll_/portfolio', '500');

      renderWithRouter('/portfolio');

      // Run any timers
      vi.runAllTimers();

      // Should not restore on mount, only on popstate
      expect(mockScrollTo).not.toHaveBeenCalled();
    });
  });

  describe('Scroll Position Saving', () => {
    it('saves scroll position on scroll events (debounced)', () => {
      renderWithRouter('/portfolio');

      // Simulate scroll
      mockScrollY = 800;
      window.dispatchEvent(new Event('scroll'));

      // Wait for debounce
      vi.advanceTimersByTime(100);

      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'scroll_/portfolio',
        '800'
      );
    });

    it('debounces scroll saves to avoid excessive writes', () => {
      renderWithRouter('/portfolio');

      // Simulate multiple rapid scrolls
      mockScrollY = 100;
      window.dispatchEvent(new Event('scroll'));
      mockScrollY = 200;
      window.dispatchEvent(new Event('scroll'));
      mockScrollY = 300;
      window.dispatchEvent(new Event('scroll'));

      // Before debounce timeout
      expect(mockSessionStorage.setItem).not.toHaveBeenCalledWith(
        'scroll_/portfolio',
        expect.any(String)
      );

      // After debounce timeout - should only save the last value
      vi.advanceTimersByTime(100);

      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'scroll_/portfolio',
        '300'
      );
    });

    it('does not save scroll position when navigating', () => {
      // Suppress JSDOM navigation error for this test
      const originalError = console.error;
      console.error = vi.fn((...args) => {
        if (
          args[0] === 'Error: Not implemented: navigation (except hash changes)'
        ) {
          return; // Suppress this specific error
        }
        return originalError(...args);
      });

      const { unmount } = renderWithRouter('/portfolio');

      // Simulate navigation start (click on link)
      const link = document.createElement('a');
      link.href = '/coin/bitcoin';
      document.body.appendChild(link);

      // Simulate click event - this will trigger the navigation detection
      link.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      // Now scroll - should not save because navigating
      mockScrollY = 1000;
      window.dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(100);

      expect(mockSessionStorage.setItem).not.toHaveBeenCalledWith(
        'scroll_/portfolio',
        '1000'
      );

      document.body.removeChild(link);

      // Restore console.error
      console.error = originalError;
    });

    it('does not save when restoring scroll', () => {
      renderWithRouter('/portfolio');

      // Start popstate restoration
      window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
      vi.advanceTimersByTime(10);

      // Try to scroll during restoration - should not save
      mockScrollY = 1000;
      window.dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(100);

      // Should not save because isRestoringRef is true
      expect(mockSessionStorage.setItem).not.toHaveBeenCalledWith(
        'scroll_/portfolio',
        '1000'
      );
    });
  });

  describe('Component Behavior', () => {
    it('renders nothing (returns null)', () => {
      const { container } = renderWithRouter('/portfolio');

      expect(container.firstChild).toBeNull();
    });

    it('cleans up scroll listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = renderWithRouter('/portfolio');
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });
  });
});
