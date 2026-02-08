import { useCallback } from 'react';

export const useImageErrorHandler = () => {
  return useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    // Hide broken image and show text fallback
    target.style.display = 'none';
    
    // Create a text fallback element
    const fallback = document.createElement('div');
    fallback.className = 'w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600';
    fallback.textContent = target.alt?.charAt(0).toUpperCase() || '?';
    fallback.setAttribute('aria-label', `Fallback for ${target.alt} icon`);
    
    // Insert fallback after the image
    if (target.parentNode) {
      target.parentNode.insertBefore(fallback, target.nextSibling);
    }
  }, []);
};
