import { createFileRoute } from "@tanstack/react-router";
import landingHtml from "@/content/landing.html?raw";
import landingScript from "@/content/landing.script.js?raw";
import landingCssUrl from "@/styles/landing.css?url";
import { InjectHtml } from "@/lib/InjectHtml";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Contabilidade Nobel | Mais que Contabilidade. Inteligência para o crescimento.",
      },
      {
        name: "description",
        content:
          "Contabilidade Nobel: assessoria contábil, tributária e financeira com inteligência para o crescimento do seu negócio.",
      },
      { property: "og:title", content: "Contabilidade Nobel" },
      {
        property: "og:description",
        content:
          "Mais que contabilidade. Inteligência para o crescimento do seu negócio.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <InjectHtml
      html={landingHtml}
      inlineScript={landingScript}
      externalScripts={[
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js",
        "https://unpkg.com/lucide@latest",
      ]}
      cssUrl={landingCssUrl}
      interceptLinkSelector='a[href="app.html"], a[href$="/app"]'
      interceptTo="/app"
    />
  );
}
