import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@components/Icon';

export type KebabMenuAction = {
  label: string;
  icon: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (e: any) => void;
  to?: string;
  disabled?: boolean;
  variant?: 'default' | 'danger';
};

export type KebabMenuProps = {
  actions: KebabMenuAction[];
  ariaLabel: string;
};

export default function KebabMenu({ actions, ariaLabel }: KebabMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    buttonRef.current?.focus();
  }, []);

  const toggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const items = menuRef.current?.querySelectorAll<HTMLElement>(
          '[role="menuitem"]:not([aria-disabled="true"])'
        );
        if (!items?.length) return;

        const currentIndex = Array.from(items).findIndex(
          (item) => item === document.activeElement
        );

        let nextIndex: number;
        if (e.key === 'ArrowDown') {
          nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        } else {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        }
        items[nextIndex].focus();
      }
    },
    [close]
  );

  // Focus first menu item when opened
  useEffect(() => {
    if (isOpen) {
      const firstItem = menuRef.current?.querySelector<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"])'
      );
      firstItem?.focus();
    }
  }, [isOpen]);

  const handleActionClick = (
    action: KebabMenuAction,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    if (action.disabled) return;
    action.onClick?.(e);
    setIsOpen(false);
  };

  const itemBaseClasses =
    'flex items-center gap-3 w-full px-4 py-3 text-sm text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary tap-44';

  return (
    <div className="relative" ref={menuRef} onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        onClick={toggle}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-text-secondary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary tap-44"
        aria-label={ariaLabel}
        aria-haspopup="true"
        aria-expanded={isOpen}
        data-testid="kebab-menu-button"
      >
        <span className="text-xl leading-none select-none" aria-hidden="true">
          ⋮
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1 min-w-[180px] bg-surface border border-border rounded-lg shadow-lg z-50 overflow-hidden"
          role="menu"
          aria-label={ariaLabel}
          data-testid="kebab-menu-dropdown"
        >
          {actions.map((action, index) => {
            const variantClasses =
              action.variant === 'danger'
                ? 'text-error hover:bg-red-50 dark:hover:bg-red-900/20'
                : 'text-text hover:bg-gray-50 dark:hover:bg-gray-700/50';

            const disabledClasses = action.disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer';

            if (action.to) {
              return (
                <Link
                  key={index}
                  to={action.to}
                  role="menuitem"
                  tabIndex={0}
                  className={`${itemBaseClasses} ${variantClasses} ${disabledClasses}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  aria-disabled={action.disabled}
                  data-testid={`kebab-action-${index}`}
                >
                  <Icon glyph={action.icon} />
                  {action.label}
                </Link>
              );
            }

            return (
              <button
                key={index}
                role="menuitem"
                tabIndex={0}
                className={`${itemBaseClasses} ${variantClasses} ${disabledClasses}`}
                onClick={(e) => handleActionClick(action, e)}
                disabled={action.disabled}
                aria-disabled={action.disabled}
                data-testid={`kebab-action-${index}`}
              >
                <Icon glyph={action.icon} />
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
