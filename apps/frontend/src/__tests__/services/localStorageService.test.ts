import {
  savePortfolio,
  loadPortfolio,
  isOnboardingComplete,
  setOnboardingComplete,
} from '@services/localStorageService';

describe('localStorageService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as any).mockRestore?.();
  });

  it('saves and loads portfolio', () => {
    const data = [
      { asset: 'btc', qty: 1 },
      { asset: 'eth', qty: 2 },
    ];
    savePortfolio(data);
    const loaded = loadPortfolio();
    expect(loaded).toEqual(data);
  });

  it('handles JSON parse error on load gracefully', () => {
    localStorage.setItem('cryptoPortfolio', 'not-json');
    const loaded = loadPortfolio();
    expect(loaded).toEqual([]);
    expect(console.error).toHaveBeenCalled();
  });

  describe('onboarding persistence', () => {
    it('returns false when onboarding has not been completed', () => {
      expect(isOnboardingComplete()).toBe(false);
    });

    it('returns true after setOnboardingComplete is called', () => {
      setOnboardingComplete();
      expect(isOnboardingComplete()).toBe(true);
    });

    it('persists onboarding state across calls', () => {
      setOnboardingComplete();
      // Simulate a fresh read
      expect(localStorage.getItem('cryptoPortfolio_onboardingComplete')).toBe(
        'true'
      );
    });
  });
});
