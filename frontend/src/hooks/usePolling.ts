// src/hooks/usePolling.ts
import { useEffect, useRef } from "react";

type UsePollingOptions = {
  interval?: number;
  immediate?: boolean;
};

export function usePolling(
  callback: () => void | Promise<void>,
  { interval = 60000, immediate = true }: UsePollingOptions = {}
) {
  const savedCallback = useRef(callback);

  // Keep ref updated to always use the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    let isMounted = true;

    const tick = () => {
      if (!isMounted) return;
      savedCallback.current();
    };

    if (immediate) tick(); // call immediately on mount

    const id = setInterval(tick, interval);

    return () => {
      isMounted = false;
      if (typeof clearInterval === "function") {
        clearInterval(id);
      }
    };
  }, [interval, immediate]);
}
