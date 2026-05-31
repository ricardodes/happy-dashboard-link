import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { generateBusinessInsights, generateMarketingCopy } from "@/lib/erp-ai.functions";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  LogOut, TrendingUp, TrendingDown, Users, Calendar, CheckSquare,
  Sparkles, Megaphone, Plus, Trash2, Download, RefreshCw, DollarSign, Target, Map as MapIcon, ExternalLink
} from "lucide-react";
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

const BRL = (n: number) =>
  (n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function ErpPage() {
  const navigate = useNavigate();

  return (
    <div className="erp-root" style={{ background: '#f8fafc', minHeight: '100vh', width: '100%' }}>
      <InjectHtml
        html={erpHtml}
        inlineScript={erpScript}
        externalScripts={[
          "https://cdn.jsdelivr.net/npm/chart.js",
          "https://unpkg.com/lucide@latest",
        ]}
        cssUrl={erpCssUrl}
      />
    </div>
  );
}
