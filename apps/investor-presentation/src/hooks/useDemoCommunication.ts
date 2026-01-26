import { useEffect, useRef, useState } from 'react';

type DemoStatus = 'idle' | 'loading' | 'ready' | 'error';

interface DemoMessage {
  type: string;
  payload?: unknown;
}

interface UseDemoCommunicationOptions {
  origin: string;
}

export function useDemoCommunication({ origin }: UseDemoCommunicationOptions) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [status, setStatus] = useState<DemoStatus>('idle');
  const [lastEvent, setLastEvent] = useState<DemoMessage | null>(null);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== origin) return;
      const data = event.data as DemoMessage;
      setLastEvent(data);
      if (data?.type === 'DEMO_READY') {
        setStatus('ready');
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [origin]);

  const onLoad = () => setStatus('ready');
  const onError = () => setStatus('error');

  const postMessage = (message: DemoMessage) => {
    if (!iframeRef.current) return;
    iframeRef.current.contentWindow?.postMessage(message, origin);
  };

  return {
    iframeRef,
    status,
    lastEvent,
    setStatus,
    onLoad,
    onError,
    postMessage,
  };
}
