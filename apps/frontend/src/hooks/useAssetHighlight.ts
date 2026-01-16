import { useState, useEffect } from "react";

/**
 * Hook to manage temporary visual highlight for an asset after operations
 * Returns true for 3 seconds after the trigger counter changes
 * 
 * @param assetId - The ID of the asset to potentially highlight
 * @param triggerCounter - Counter that increments when highlight should trigger
 * @returns isHighlighted - Boolean indicating if asset should be highlighted
 */
export function useAssetHighlight(assetId: string, triggerCounter: number): boolean {
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    // Only trigger if counter is greater than 0 (initial state is 0)
    if (triggerCounter === 0) {
      return;
    }

    // Activate highlight
    setIsHighlighted(true);

    // Clear highlight after 3 seconds
    const timeout = setTimeout(() => {
      setIsHighlighted(false);
    }, 3000);

    // Cleanup timeout on unmount or re-trigger
    return () => clearTimeout(timeout);
  }, [triggerCounter]);

  return isHighlighted;
}
