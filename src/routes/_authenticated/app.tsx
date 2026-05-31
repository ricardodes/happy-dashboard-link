import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateBusinessInsights, generateMarketingCopy, searchProspectsAI } from "@/lib/erp-ai.functions";
import erpHtml from "@/content/erp.html?raw";
import erpScript from "@/content/erp.script.js?raw";
import erpCssUrl from "@/styles/erp.css?url";
import { InjectHtml } from "@/lib/InjectHtml";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({
    meta: [
      { title: "Plataforma Nobel | ERP Contábil" },
      { name: "description", content: "Dashboard ERP da Contabilidade Nobel." },
    ],
  }),
  component: ErpPage,
});

function ErpPage() {
  const marketingFn = useServerFn(generateMarketingCopy);
  const insightsFn = useServerFn(generateBusinessInsights);
  const prospectsFn = useServerFn(searchProspectsAI);

  useEffect(() => {
    const getApiKey = () => localStorage.getItem('nobel_groq_key') || undefined;
    
    (window as any).generateMarketingCopy = (data: any) => marketingFn({ data: { ...data, apiKey: getApiKey() } });
    (window as any).generateBusinessInsights = (data: any) => insightsFn({ data: { ...data, apiKey: getApiKey() } });
    (window as any).searchProspectsAI = (data: any) => prospectsFn({ data: { ...data, apiKey: getApiKey() } });
  }, [marketingFn, insightsFn, prospectsFn]);

  return (
    <div className="erp-root" style={{ minHeight: '100vh', width: '100%' }}>
      <InjectHtml
        html={erpHtml}
        inlineScript={erpScript}
        externalScripts={[]}
        cssUrl={erpCssUrl}
      />
    </div>
  );
}