import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import type { CoinInfo } from '@services/coinService';
import type { PortfolioState } from '@hooks/usePortfolioState';
import { ChevronDownIcon, XIcon } from 'lucide-react';

type Props = {
  id?: string;
  coins: CoinInfo[];
  search: string;
  onSearchChange: (value: string) => void;
  onSelect: (coin: CoinInfo) => void;
  disabled?: boolean;
  error?: string | null;
  describedById?: string;
  portfolio?: PortfolioState;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
};

export function AssetSelector({
  id,
  coins,
  search,
  onSearchChange,
  onSelect,
  disabled = false,
  error,
  describedById,
  portfolio,
  triggerRef,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<CoinInfo | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // -1 = filter input, 0+ = option index
  const containerRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLInputElement>(null);
  const internalTriggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Pre-compute owned quantities map for O(1) lookup (performance optimization)
  const ownedQuantities = useMemo(() => {
    if (!portfolio || portfolio.length === 0) return {};

    return portfolio.reduce(
      (acc, asset) => {
        acc[asset.coinInfo.id] = asset.quantity;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [portfolio]);

  // Check if user has any assets to show the summing tip
  const hasOwnedAssets = Object.keys(ownedQuantities).length > 0;

  // Fix #1 & #11: Move localStorage access to useEffect to avoid hydration mismatch;
  // validate stored value before parsing.
  const [showTip, setShowTip] = useState(true);

  useEffect(() => {
    try {
      const dismissedAt = localStorage.getItem('asset-selector-tip-dismissed');
      if (!dismissedAt) return;

      const dismissedTime = Number(dismissedAt);
      if (Number.isNaN(dismissedTime) || dismissedTime <= 0) {
        localStorage.removeItem('asset-selector-tip-dismissed');
        return;
      }

      const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < oneWeekMs) {
        setShowTip(false);
      }
    } catch {
      // localStorage may be unavailable (e.g. SSR, privacy mode)
    }
  }, []);

  const dismissTip = () => {
    setShowTip(false);
    try {
      localStorage.setItem(
        'asset-selector-tip-dismissed',
        Date.now().toString()
      );
    } catch {
      // localStorage may be unavailable
    }
  };

  // Fix #2: Only attach outside-click listener when dropdown is open
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Fix #5: Sync selectedCoin when coins prop changes (e.g. after refetch)
  useEffect(() => {
    if (selectedCoin && !coins.find((c) => c.id === selectedCoin.id)) {
      setSelectedCoin(null);
    }
  }, [coins, selectedCoin]);

  // Focus filter input when dropdown opens and reset highlighted index
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(-1);
      filterRef.current?.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      e.preventDefault();
      setIsOpen(true);
      return;
    }

    if (!isOpen) return;

    switch (e.key) {
      // Fix #3: Use ref-based scroll instead of global DOM query
      // Fix #6: Guard against empty coins array
      case 'ArrowDown':
        e.preventDefault();
        if (coins.length > 0 && highlightedIndex < coins.length - 1) {
          const newIndex = highlightedIndex + 1;
          setHighlightedIndex(newIndex);
          setTimeout(() => {
            optionRefs.current[newIndex]?.scrollIntoView({
              block: 'nearest',
              behavior: 'smooth',
            });
          }, 0);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (highlightedIndex > -1) {
          const newIndex = highlightedIndex - 1;
          setHighlightedIndex(newIndex);
          if (newIndex >= 0) {
            setTimeout(() => {
              optionRefs.current[newIndex]?.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth',
              });
            }, 0);
          }
        }
        break;
      // Fix #7: Fallback when quantity field is missing or disabled
      case 'Enter':
        e.preventDefault();
        e.stopPropagation();
        if (highlightedIndex >= 0 && coins[highlightedIndex]) {
          handleSelect(coins[highlightedIndex]);
          const quantityField = document.getElementById(
            'asset-quantity'
          ) as HTMLInputElement | null;
          if (quantityField && !quantityField.disabled) {
            quantityField.focus();
          } else {
            (triggerRef || internalTriggerRef).current?.focus();
          }
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        (triggerRef || internalTriggerRef).current?.focus();
        break;
    }
  };

  const handleSelect = (coin: CoinInfo) => {
    setSelectedCoin(coin);
    onSelect(coin);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onSearchChange('');
  };

  // Fix #10: Memoize to avoid recreation on every render
  const getDisplayName = useCallback(
    (coin: CoinInfo) => {
      const ownedQty = ownedQuantities[coin.id];
      return ownedQty
        ? `${coin.name} (${coin.symbol.toUpperCase()}) - Owned: ${ownedQty}`
        : `${coin.name} (${coin.symbol.toUpperCase()})`;
    },
    [ownedQuantities]
  );

  return (
    <div className="flex flex-col gap-3">
      {hasOwnedAssets && showTip && (
        <div
          className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-3 py-2 flex items-start gap-2"
          role="note"
          aria-label="Information about adding to existing assets"
        >
          <span aria-hidden="true">ℹ️</span>
          <span className="flex-1">
            <strong>Tip:</strong> Adding to an existing asset will increase your
            total quantity.
          </span>
          <button
            type="button"
            onClick={dismissTip}
            className="text-blue-500 hover:text-blue-700 p-1 rounded-sm hover:bg-blue-100 transition-colors"
            aria-label="Dismiss tip"
            title="Dismiss this tip for one week"
          >
            <XIcon className="w-3 h-3" aria-hidden="true" />
          </button>
        </div>
      )}

      {error ? (
        <div
          className="text-sm text-red-600"
          role="alert"
          aria-live="assertive"
        >
          ⚠️ {error}
        </div>
      ) : (
        <div ref={containerRef} className="relative" id={id}>
          {/* Dropdown trigger */}
          <button
            ref={triggerRef || internalTriggerRef}
            type="button"
            data-testid="asset-select"
            disabled={disabled}
            className="input w-full text-left flex items-center justify-between"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-describedby={describedById}
            onClick={() => setIsOpen((prev) => !prev)}
            onKeyDown={handleKeyDown}
          >
            <span className={selectedCoin ? 'text-gray-900' : 'text-gray-500'}>
              {selectedCoin
                ? getDisplayName(selectedCoin)
                : 'Select a crypto asset'}
            </span>
            <ChevronDownIcon
              className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>

          {/* Dropdown panel */}
          {isOpen && (
            <div
              className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden"
              role="listbox"
              aria-label="Asset options"
              onKeyDown={handleKeyDown}
            >
              {/* Sticky filter input */}
              <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-2">
                <label htmlFor="asset-search" className="sr-only">
                  Filter assets
                </label>
                <input
                  ref={filterRef}
                  id="asset-search"
                  type="text"
                  placeholder="Search assets..."
                  className={`border border-gray-200 rounded-md px-3 py-2 w-full text-base ${
                    highlightedIndex === -1 ? 'ring-2 ring-brand-primary' : ''
                  }`}
                  aria-describedby="asset-search-help"
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  disabled={disabled}
                  onClick={(e) => e.stopPropagation()}
                  onFocus={() => setHighlightedIndex(-1)}
                />
                <div id="asset-search-help" className="sr-only">
                  Enter text to filter the list of assets.
                </div>
              </div>

              {/* Scrollable option list */}
              <div className="max-h-48 overflow-y-auto">
                {coins.length === 0 ? (
                  <div className="px-3 py-3 text-sm text-gray-500">
                    No assets found.
                  </div>
                ) : (
                  coins.map((coin, index) => {
                    const displayName = getDisplayName(coin);
                    const isSelected = selectedCoin?.id === coin.id;

                    return (
                      <button
                        key={coin.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        aria-label={displayName}
                        ref={(el) => {
                          optionRefs.current[index] = el;
                        }}
                        className={`w-full text-left px-3 py-3 text-sm cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-purple-50 text-brand-primary font-medium'
                            : highlightedIndex === index
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => handleSelect(coin)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                      >
                        {displayName}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
