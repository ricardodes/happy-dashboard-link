import { useEffect, useRef } from "react";
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
 *
 * Used to host the legacy Nobel landing + ERP HTML inside the React app
 * without rewriting 4600 lines of markup.
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

  // Load CSS once per cssUrl (dev: just append a <link> with a data attr we can dedupe on)
  useEffect(() => {
    if (!cssUrl) return;
    const id = `inject-css-${cssUrl}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = cssUrl;
    document.head.appendChild(link);
  }, [cssUrl]);

  // Load external scripts (sequentially, then run inline script)
  useEffect(() => {
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
    // We intentionally don't depend on the script arrays' identity; html is the key signal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html]);

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
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
