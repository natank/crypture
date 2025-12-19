import { useState, useMemo, useRef, useEffect } from "react";
import type { CoinInfo } from "@services/coinService";

interface CoinSelectorProps {
  coins: CoinInfo[];
  onSelect: (coin: CoinInfo) => void;
  excludeIds: string[];
  disabled?: boolean;
  error?: string | null;
}

export function CoinSelector({
  coins,
  onSelect,
  excludeIds,
  disabled = false,
  error,
}: CoinSelectorProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCoins = useMemo(() => {
    const term = search.toLowerCase();
    return coins
      .filter((coin) => !excludeIds.includes(coin.id))
      .filter(
        (coin) =>
          coin.name.toLowerCase().includes(term) ||
          coin.symbol.toLowerCase().includes(term)
      )
      .slice(0, 10); // Limit results for performance
  }, [search, coins, excludeIds]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (coin: CoinInfo) => {
    onSelect(coin);
    setSearch("");
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  if (error) {
    return (
      <div
        className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
        role="alert"
      >
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor="coin-search" className="sr-only">
        Search for a coin to add
      </label>
      <input
        ref={inputRef}
        id="coin-search"
        type="text"
        placeholder="Search coins to add..."
        className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-text-primary placeholder-text-secondary focus-ring"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-controls="coin-search-results"
        aria-autocomplete="list"
        data-testid="coin-selector-input"
      />

      {isOpen && search.length > 0 && (
        <ul
          id="coin-search-results"
          className="absolute z-10 w-full mt-1 bg-surface border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto"
          role="listbox"
          data-testid="coin-selector-results"
        >
          {filteredCoins.length === 0 ? (
            <li className="px-4 py-3 text-text-secondary">No coins found</li>
          ) : (
            filteredCoins.map((coin) => (
              <li key={coin.id}>
                <button
                  type="button"
                  className="w-full px-4 py-3 text-left hover:bg-surface-soft focus:bg-surface-soft focus-ring flex items-center gap-3"
                  onClick={() => handleSelect(coin)}
                  role="option"
                  aria-selected="false"
                >
                  <span className="font-medium text-text-primary">
                    {coin.name}
                  </span>
                  <span className="text-text-secondary uppercase text-sm">
                    {coin.symbol}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
