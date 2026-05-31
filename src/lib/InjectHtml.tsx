import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

interface InjectHtmlProps {
  html: string;
  inlineScript?: string;
  externalScripts?: string[];
  cssUrl?: string;
  /** Selector for anchors whose clicks should be intercepted and routed via TanStack */
  interceptLinkSelector?: string;
  /** Where to send intercepted link clicks */
  interceptTo?: string;
  className?: string;
}

/**
 * Renders raw HTML inside a React component, loads required CDN scripts,
 * runs the original page's inline script, and intercepts internal anchor
 * clicks so they go through the TanStack router.
 */
export function InjectHtml({
  html,
  inlineScript,
  externalScripts = [],
  cssUrl,
  interceptLinkSelector,
  interceptTo,
  className,
}: InjectHtmlProps) {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  // Load CSS once per cssUrl, remove on unmount so styles don't leak across routes.
  useEffect(() => {
    if (!cssUrl) {
      setReady(true);
      return;
    }
    const id = `inject-css-${cssUrl}`;
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = cssUrl;
      link.onload = () => setReady(true);
      document.head.appendChild(link);
    } else {
      setReady(true);
    }
    return () => {
      // Keep CSS if it's already there to avoid flashes, or remove if you want strict isolation
      // link?.remove();
    };
  }, [cssUrl]);

  // Load external scripts (sequentially, then run inline script)
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;

    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        const existing = document.querySelector(
          `script[data-injected="${src}"]`,
        ) as HTMLScriptElement | null;
        if (existing) {
          if ((existing as any)._loaded) return resolve();
          existing.addEventListener("load", () => resolve());
          existing.addEventListener("error", () => reject(new Error(src)));
          return;
        }
        const s = document.createElement("script");
        s.src = src;
        s.async = false;
        s.dataset.injected = src;
        s.addEventListener("load", () => {
          (s as any)._loaded = true;
          resolve();
        });
        s.addEventListener("error", () => reject(new Error(src)));
        document.head.appendChild(s);
      });

    (async () => {
      try {
        for (const src of externalScripts) {
          await loadScript(src);
        }
        if (cancelled) return;
        if (inlineScript) {
          try {
            // eslint-disable-next-line no-new-func
            new Function(inlineScript)();
          } catch (err) {
            console.error("[InjectHtml] inline script error", err);
          }
        }
      } catch (err) {
        console.error("[InjectHtml] failed loading external script", err);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html, ready]);

  // Intercept internal nav clicks
  useEffect(() => {
    if (!interceptLinkSelector || !interceptTo || !ref.current) return;
    const root = ref.current;
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(interceptLinkSelector);
      if (!target) return;
      e.preventDefault();
      navigate({ to: interceptTo });
    };
    root.addEventListener("click", handler);
    return () => root.removeEventListener("click", handler);
  }, [interceptLinkSelector, interceptTo, navigate, html]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ visibility: ready ? 'visible' : 'hidden', opacity: ready ? 1 : 0, transition: 'opacity 0.2s' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
