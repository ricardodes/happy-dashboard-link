import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import erpHtml from "@/content/erp.html?raw";
import erpScript from "@/content/erp.script.js?raw";
import erpCssUrl from "@/styles/erp.css?url";
import { InjectHtml } from "@/lib/InjectHtml";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({
    meta: [
      { title: "Plataforma Nobel | Enterprise" },
      {
        name: "description",
        content: "Dashboard ERP da Contabilidade Nobel.",
      },
    ],
  }),
  component: ErpPage,
});

function ErpPage() {
  const navigate = useNavigate();

  // The ERP CSS sets `body { overflow: hidden; height: 100vh }` — restore on unmount
  useEffect(() => {
    const prev = {
      overflow: document.body.style.overflow,
      height: document.body.style.height,
    };
    document.body.classList.add("erp-active");
    return () => {
      document.body.classList.remove("erp-active");
      document.body.style.overflow = prev.overflow;
      document.body.style.height = prev.height;
    };
  }, []);

  return (
    <>
      <InjectHtml
        html={erpHtml}
        inlineScript={erpScript}
        externalScripts={[
          "https://cdn.jsdelivr.net/npm/chart.js",
          "https://unpkg.com/lucide@latest",
        ]}
        cssUrl={erpCssUrl}
      />
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          navigate({ to: "/login" });
        }}
        className="fixed bottom-4 right-4 z-[9999] rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg hover:opacity-90"
        style={{
          background: "#0a5c3a",
          color: "white",
        }}
      >
        Sair
      </button>
    </>
  );
}
