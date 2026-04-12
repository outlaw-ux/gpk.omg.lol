import { useEffect, useEffectEvent, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact' | 'flexible';
          action?: string;
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
        }
      ) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId?: string) => void;
    };
  }
}

const TURNSTILE_SCRIPT_ID = 'cf-turnstile-script';
const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let turnstileScriptPromise: Promise<void> | null = null;

const loadTurnstileScript = () => {
  if (window.turnstile) {
    return Promise.resolve();
  }

  if (turnstileScriptPromise) {
    return turnstileScriptPromise;
  }

  turnstileScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Turnstile failed to load.')),
        { once: true }
      );
      return;
    }

    const script = document.createElement('script');
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Turnstile failed to load.'));
    document.head.append(script);
  });

  return turnstileScriptPromise;
};

type TurnstileWidgetProps = {
  resetNonce: number;
  siteKey: string;
  onError: (message: string) => void;
  onTokenChange: (token: string) => void;
};

export function TurnstileWidget({
  resetNonce,
  siteKey,
  onError,
  onTokenChange
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const mountedRef = useRef(true);
  const [isReady, setIsReady] = useState(false);
  const emitError = useEffectEvent(onError);
  const emitTokenChange = useEffectEvent(onTokenChange);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const renderWidget = async () => {
      try {
        await loadTurnstileScript();

        if (isCancelled || !mountedRef.current || !containerRef.current || !window.turnstile) {
          return;
        }

        if (widgetIdRef.current) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }

        containerRef.current.innerHTML = '';
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: 'dark',
          size: 'flexible',
          action: 'submit_card_request',
          callback: (token) => {
            emitError('');
            emitTokenChange(token);
          },
          'expired-callback': () => {
            emitTokenChange('');
            emitError('Verification expired. Please try again.');
          },
          'error-callback': () => {
            emitTokenChange('');
            emitError('Verification failed. Reload and try again.');
          }
        });

        if (!isCancelled && mountedRef.current) {
          setIsReady(true);
        }
      } catch (error) {
        if (!isCancelled && mountedRef.current) {
          setIsReady(false);
          emitTokenChange('');
          emitError(error instanceof Error ? error.message : 'Turnstile failed to load.');
        }
      }
    };

    setIsReady(false);
    renderWidget();

    return () => {
      isCancelled = true;

      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [emitError, emitTokenChange, resetNonce, siteKey]);

  return (
    <div className="turnstile-block">
      <div className="turnstile-shell" data-ready={isReady ? 'true' : 'false'}>
        <div ref={containerRef} />
      </div>
    </div>
  );
}
