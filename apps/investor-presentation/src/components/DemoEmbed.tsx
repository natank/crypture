import { useDemoCommunication } from '../hooks/useDemoCommunication';

interface DemoEmbedProps {
  src: string;
  origin: string;
}

export function DemoEmbed({ src, origin }: DemoEmbedProps) {
  const { iframeRef, status, onLoad, onError, postMessage } = useDemoCommunication({ origin });

  return (
    <div className="demo-embed">
      <div className="demo-embed__header">
        <span className="label">Live product demo</span>
        <div className="demo-embed__status">{status}</div>
        <button
          className="cta-secondary"
          type="button"
          onClick={() => postMessage({ type: 'START_TOUR' })}
        >
          Start Tour
        </button>
      </div>
      <div className="demo-embed__frame">
        <iframe
          ref={iframeRef}
          src={src}
          title="Crypture Demo"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={onLoad}
          onError={onError}
        />
      </div>
      {status === 'error' && (
        <div className="demo-embed__fallback">
          Demo unavailable. Continue to the next section.
        </div>
      )}
    </div>
  );
}
