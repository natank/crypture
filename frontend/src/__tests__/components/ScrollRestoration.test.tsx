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
  });

  const renderWithRouter = (initialPath: string = '/portfolio') => {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <ScrollRestoration />
      </MemoryRouter>
    );
  };

  describe('Scroll Position Restoration', () => {
    it('restores saved scroll position on mount', () => {
      mockSessionStorage.setItem('scroll_/portfolio', '500');

      renderWithRouter('/portfolio');

      // Run the setTimeout
      vi.runAllTimers();

      expect(mockScrollTo).toHaveBeenCalledWith(0, 500);
    });

    it('scrolls to top when no saved position exists', () => {
      renderWithRouter('/portfolio');

      // Run the setTimeout
      vi.runAllTimers();

      expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
    });

    it('uses route-specific storage keys', () => {
      mockSessionStorage.setItem('scroll_/coin/bitcoin', '300');

      renderWithRouter('/coin/bitcoin');

      vi.runAllTimers();

      expect(mockScrollTo).toHaveBeenCalledWith(0, 300);
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

    it('saves final scroll position on unmount', () => {
      const { unmount } = renderWithRouter('/portfolio');

      mockScrollY = 1000;
      unmount();

      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
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
