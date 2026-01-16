import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const SCROLL_STORAGE_KEY_PREFIX = 'scroll_';

/**
 * ScrollRestoration component manages scroll position persistence per route.
 * 
 * Strategy:
 * 1. Disable browser's automatic scroll restoration
 * 2. Save scroll position on scroll events (debounced)
 * 3. On navigation, restore saved position for the new route
 * 4. Use popstate event to detect back/forward navigation
 */
export function ScrollRestoration() {
  const location = useLocation();
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRestoringRef = useRef(false);
  const currentPathRef = useRef(location.pathname);
  const isNavigatingRef = useRef(false);

  // Disable browser's automatic scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  // Handle popstate (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      // Small delay to let React Router update location
      setTimeout(() => {
        const newPath = window.location.pathname;
        const storageKey = `${SCROLL_STORAGE_KEY_PREFIX}${newPath}`;
        const savedScrollY = sessionStorage.getItem(storageKey);
        const targetScrollY = savedScrollY ? parseInt(savedScrollY, 10) : 0;
        
        isRestoringRef.current = true;
        
        // Restore scroll with retries (page content may still be loading)
        let attempts = 0;
        const restore = () => {
          attempts++;
          window.scrollTo(0, targetScrollY);
          
          if (Math.abs(window.scrollY - targetScrollY) < 20 || attempts >= 10) {
            setTimeout(() => {
              isRestoringRef.current = false;
            }, 200);
          } else {
            setTimeout(restore, 50);
          }
        };
        restore();
      }, 10);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Detect navigation start (clicking links) to lock scroll saving
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link && link.href && !link.href.startsWith('javascript:')) {
        // Mark navigation starting - stop saving scroll
        isNavigatingRef.current = true;
      }
    };
    
    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, []);

  // Save scroll position on scroll
  useEffect(() => {
    const storageKey = `${SCROLL_STORAGE_KEY_PREFIX}${location.pathname}`;
    
    // Reset navigation flag when path changes (navigation complete)
    if (currentPathRef.current !== location.pathname) {
      isNavigatingRef.current = false;
    }
    currentPathRef.current = location.pathname;

    // Save scroll position (debounced)
    const saveScroll = () => {
      if (isRestoringRef.current || isNavigatingRef.current) return;
      try {
        sessionStorage.setItem(storageKey, window.scrollY.toString());
      } catch {
        // Fail silently - storage might be full or unavailable
      }
    };

    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(saveScroll, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [location.pathname]);

  return null;
}
