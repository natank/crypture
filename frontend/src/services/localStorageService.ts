const STORAGE_KEY = "cryptoPortfolio";

export function savePortfolio(data: { asset: string; qty: number }[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save portfolio:", err);
  }
}

export function loadPortfolio(): { asset: string; qty: number }[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to load portfolio:", err);
    return [];
  }
}
