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
  Sparkles, Megaphone, Plus, Trash2, Download, RefreshCw, DollarSign, Target,
} from "lucide-react";

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

// ---------------------------------------------------------------------------
// ROOT
// ---------------------------------------------------------------------------

function ErpPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-emerald-700 to-emerald-500 font-bold text-white">
              N
            </div>
            <div>
              <h1 className="text-base font-semibold leading-none">Plataforma Nobel</h1>
              <p className="text-xs text-muted-foreground">ERP da Contabilidade</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/login" });
            }}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6 flex w-full flex-wrap justify-start gap-1 bg-transparent p-0">
            <TabsTrigger value="overview"><TrendingUp className="mr-1.5 h-4 w-4" />Visão Geral</TabsTrigger>
            <TabsTrigger value="finance"><DollarSign className="mr-1.5 h-4 w-4" />Financeiro</TabsTrigger>
            <TabsTrigger value="clients"><Users className="mr-1.5 h-4 w-4" />Clientes</TabsTrigger>
            <TabsTrigger value="leads"><Target className="mr-1.5 h-4 w-4" />Captação</TabsTrigger>
            <TabsTrigger value="agenda"><Calendar className="mr-1.5 h-4 w-4" />Agenda</TabsTrigger>
            <TabsTrigger value="tasks"><CheckSquare className="mr-1.5 h-4 w-4" />Tarefas</TabsTrigger>
            <TabsTrigger value="marketing"><Megaphone className="mr-1.5 h-4 w-4" />Marketing IA</TabsTrigger>
          </TabsList>

          <TabsContent value="overview"><OverviewTab /></TabsContent>
          <TabsContent value="finance"><FinanceTab /></TabsContent>
          <TabsContent value="clients"><ClientsTab /></TabsContent>
          <TabsContent value="leads"><LeadsTab /></TabsContent>
          <TabsContent value="agenda"><AgendaTab /></TabsContent>
          <TabsContent value="tasks"><TasksTab /></TabsContent>
          <TabsContent value="marketing"><MarketingTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// OVERVIEW — KPIs + AI Insights
// ---------------------------------------------------------------------------

function OverviewTab() {
  const qc = useQueryClient();
  const aiFn = useServerFn(generateBusinessInsights);
  const [insights, setInsights] = useState<string>("");
  const [loadingAI, setLoadingAI] = useState(false);

  const { data: tx = [] } = useQuery({
    queryKey: ["tx-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions").select("*").order("occurred_on", { ascending: false });
      if (error) throw error; return data;
    },
  });
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("*");
      if (error) throw error; return data;
    },
  });
  const { data: leads = [] } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("leads").select("*");
      if (error) throw error; return data;
    },
  });

  const k = useMemo(() => {
    const now = new Date();
    const ym = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const thisMonth = ym(now);
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonth = ym(prevDate);

    const sumK = (rows: any[], k: "receita" | "despesa", m: string) =>
      rows.filter((r) => r.kind === k && r.occurred_on?.startsWith(m))
          .reduce((s, r) => s + Number(r.amount || 0), 0);

    const recNow = sumK(tx, "receita", thisMonth);
    const recPrev = sumK(tx, "receita", prevMonth);
    const despNow = sumK(tx, "despesa", thisMonth);
    const despPrev = sumK(tx, "despesa", prevMonth);
    const lucroNow = recNow - despNow;
    const lucroPrev = recPrev - despPrev;
    const growth = recPrev > 0 ? ((recNow - recPrev) / recPrev) * 100 : 0;
    const margem = recNow > 0 ? (lucroNow / recNow) * 100 : 0;
    const ativos = (clients as any[]).filter((c) => c.status === "ativo").length;
    const mrr = (clients as any[])
      .filter((c) => c.status === "ativo")
      .reduce((s, c) => s + Number(c.monthly_fee || 0), 0);
    const leadsAtivos = (leads as any[]).filter((l) => l.stage !== "perdido" && l.stage !== "ganho").length;
    const ganhos = (leads as any[]).filter((l) => l.stage === "ganho").length;
    const totalFunil = (leads as any[]).length;
    const conv = totalFunil > 0 ? (ganhos / totalFunil) * 100 : 0;

    // Última 6 meses
    const series: { m: string; rec: number; desp: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = ym(d);
      series.push({
        m: d.toLocaleDateString("pt-BR", { month: "short" }),
        rec: sumK(tx, "receita", m),
        desp: sumK(tx, "despesa", m),
      });
    }

    return { recNow, recPrev, despNow, lucroNow, lucroPrev, growth, margem, ativos, mrr, leadsAtivos, conv, series };
  }, [tx, clients, leads]);

  const buildSnapshot = () =>
    [
      `Receita mês atual: ${BRL(k.recNow)}`,
      `Receita mês anterior: ${BRL(k.recPrev)}`,
      `Crescimento: ${k.growth.toFixed(1)}%`,
      `Despesas mês: ${BRL(k.despNow)}`,
      `Lucro mês: ${BRL(k.lucroNow)} (margem ${k.margem.toFixed(1)}%)`,
      `Clientes ativos: ${k.ativos} | MRR: ${BRL(k.mrr)}`,
      `Leads em aberto: ${k.leadsAtivos} | Conversão histórica: ${k.conv.toFixed(1)}%`,
      `Últimos 6 meses (receita): ${k.series.map((s) => `${s.m}=${BRL(s.rec)}`).join(", ")}`,
    ].join("\n");

  const runInsights = async () => {
    setLoadingAI(true);
    try {
      const r = await aiFn({ data: { snapshot: buildSnapshot() } });
      setInsights(r.content);
    } catch (e: any) {
      toast.error(e?.message ?? "Falha ao gerar insights");
    } finally {
      setLoadingAI(false);
    }
  };

  const maxRec = Math.max(1, ...k.series.map((s) => Math.max(s.rec, s.desp)));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Kpi title="Receita do mês" value={BRL(k.recNow)} trend={k.growth} icon={<TrendingUp className="h-4 w-4" />} />
        <Kpi title="Despesas do mês" value={BRL(k.despNow)} icon={<TrendingDown className="h-4 w-4" />} />
        <Kpi title="Lucro do mês" value={BRL(k.lucroNow)} sub={`Margem ${k.margem.toFixed(1)}%`} icon={<DollarSign className="h-4 w-4" />} />
        <Kpi title="MRR Clientes" value={BRL(k.mrr)} sub={`${k.ativos} ativos`} icon={<Users className="h-4 w-4" />} />
        <Kpi title="Leads em aberto" value={String(k.leadsAtivos)} icon={<Target className="h-4 w-4" />} />
        <Kpi title="Conversão" value={`${k.conv.toFixed(1)}%`} sub="Leads → clientes" icon={<Target className="h-4 w-4" />} />
        <Kpi title="Crescimento MoM" value={`${k.growth.toFixed(1)}%`} icon={<TrendingUp className="h-4 w-4" />} />
        <Kpi title="Margem líquida" value={`${k.margem.toFixed(1)}%`} icon={<DollarSign className="h-4 w-4" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Receitas vs Despesas — últimos 6 meses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-end gap-3">
            {k.series.map((s) => (
              <div key={s.m} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex h-40 w-full items-end justify-center gap-1">
                  <div className="w-3 rounded-t bg-emerald-500" style={{ height: `${(s.rec / maxRec) * 100}%` }} title={`Receita: ${BRL(s.rec)}`} />
                  <div className="w-3 rounded-t bg-rose-400" style={{ height: `${(s.desp / maxRec) * 100}%` }} title={`Despesa: ${BRL(s.desp)}`} />
                </div>
                <span className="text-xs capitalize text-muted-foreground">{s.m}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-emerald-500" />Receita</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-rose-400" />Despesa</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-emerald-600" />Insights de IA</CardTitle>
            <CardDescription>Análise automática de gargalos e ações para aumentar a receita.</CardDescription>
          </div>
          <Button onClick={runInsights} disabled={loadingAI}>
            {loadingAI ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Analisar com IA
          </Button>
        </CardHeader>
        <CardContent>
          {insights ? (
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm">{insights}</div>
          ) : (
            <p className="text-sm text-muted-foreground">Clique em "Analisar com IA" para receber recomendações baseadas nos seus números.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({ title, value, sub, trend, icon }: { title: string; value: string; sub?: string; trend?: number; icon?: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <span className="text-muted-foreground">{icon}</span>
        </div>
        <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
        {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
        {typeof trend === "number" && (
          <p className={`mt-1 text-xs font-medium ${trend >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend).toFixed(1)}% vs mês anterior
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// FINANCE
// ---------------------------------------------------------------------------

function FinanceTab() {
  const qc = useQueryClient();
  const { data: tx = [] } = useQuery({
    queryKey: ["tx-all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("transactions").select("*, clients(name)").order("occurred_on", { ascending: false });
      if (error) throw error; return data;
    },
  });
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("id, name").order("name");
      if (error) throw error; return data;
    },
  });

  const [form, setForm] = useState({
    occurred_on: new Date().toISOString().slice(0, 10),
    kind: "receita" as "receita" | "despesa",
    amount: "",
    category: "",
    description: "",
    client_id: "",
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("transactions").insert({
        occurred_on: form.occurred_on,
        kind: form.kind,
        amount: Number(form.amount),
        category: form.category || null,
        description: form.description || null,
        client_id: form.client_id || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Lançamento registrado");
      qc.invalidateQueries({ queryKey: ["tx-all"] });
      setForm({ ...form, amount: "", category: "", description: "" });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tx-all"] }),
  });

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
      <Card>
        <CardHeader><CardTitle>Novo lançamento</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>Data</Label>
            <Input type="date" value={form.occurred_on} onChange={(e) => setForm({ ...form, occurred_on: e.target.value })} />
          </div>
          <div><Label>Tipo</Label>
            <Select value={form.kind} onValueChange={(v: any) => setForm({ ...form, kind: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="receita">Receita</SelectItem>
                <SelectItem value="despesa">Despesa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Valor (R$)</Label>
            <Input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          </div>
          <div><Label>Categoria</Label>
            <Input placeholder="Honorário, folha, software..." value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div><Label>Cliente (opcional)</Label>
            <Select value={form.client_id || "none"} onValueChange={(v) => setForm({ ...form, client_id: v === "none" ? "" : v })}>
              <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— Nenhum —</SelectItem>
                {(clients as any[]).map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div><Label>Descrição</Label>
            <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <Button onClick={() => create.mutate()} disabled={!form.amount || create.isPending} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Registrar
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Lançamentos</CardTitle><CardDescription>{(tx as any[]).length} registros</CardDescription></CardHeader>
        <CardContent>
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2">Data</th><th>Tipo</th><th>Valor</th><th>Categoria</th><th>Cliente</th><th></th>
                </tr>
              </thead>
              <tbody>
                {(tx as any[]).map((t) => (
                  <tr key={t.id} className="border-b hover:bg-slate-50">
                    <td className="py-2 text-xs">{new Date(t.occurred_on).toLocaleDateString("pt-BR")}</td>
                    <td><Badge variant={t.kind === "receita" ? "default" : "secondary"} className={t.kind === "receita" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}>{t.kind}</Badge></td>
                    <td className={`font-mono font-medium ${t.kind === "receita" ? "text-emerald-700" : "text-rose-700"}`}>{BRL(Number(t.amount))}</td>
                    <td className="text-xs">{t.category || "—"}</td>
                    <td className="text-xs">{t.clients?.name || "—"}</td>
                    <td><Button size="icon" variant="ghost" onClick={() => del.mutate(t.id)}><Trash2 className="h-3.5 w-3.5" /></Button></td>
                  </tr>
                ))}
                {(tx as any[]).length === 0 && (
                  <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Sem lançamentos ainda</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CLIENTS
// ---------------------------------------------------------------------------

function ClientsTab() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("*").order("name");
      if (error) throw error; return data;
    },
  });
  const [form, setForm] = useState({ name: "", document: "", segment: "", monthly_fee: "", email: "", phone: "", notes: "", status: "ativo" });
  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("clients").insert({
        name: form.name, document: form.document || null, segment: form.segment || null,
        monthly_fee: Number(form.monthly_fee || 0), email: form.email || null, phone: form.phone || null,
        notes: form.notes || null, status: form.status,
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Cliente adicionado"); qc.invalidateQueries({ queryKey: ["clients"] });
      setForm({ name: "", document: "", segment: "", monthly_fee: "", email: "", phone: "", notes: "", status: "ativo" });
    },
    onError: (e: any) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("clients").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
      <Card>
        <CardHeader><CardTitle>Novo cliente</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>Nome / Razão social</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>CNPJ/CPF</Label><Input value={form.document} onChange={(e) => setForm({ ...form, document: e.target.value })} /></div>
          <div><Label>Segmento</Label><Input value={form.segment} onChange={(e) => setForm({ ...form, segment: e.target.value })} /></div>
          <div><Label>Honorário mensal (R$)</Label><Input type="number" step="0.01" value={form.monthly_fee} onChange={(e) => setForm({ ...form, monthly_fee: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label>E-mail</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><Label>Telefone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          </div>
          <div><Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="pausado">Pausado</SelectItem>
                <SelectItem value="encerrado">Encerrado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Observações</Label><Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          <Button onClick={() => create.mutate()} disabled={!form.name || create.isPending} className="w-full"><Plus className="mr-2 h-4 w-4" />Adicionar</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Carteira</CardTitle><CardDescription>{(data as any[]).length} clientes</CardDescription></CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {(data as any[]).map((c) => (
              <div key={c.id} className="flex items-start justify-between rounded-lg border p-3 hover:bg-slate-50">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{c.name}</p>
                    <Badge variant="outline" className="text-xs">{c.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{c.segment || "—"} · {c.document || "—"}</p>
                  <p className="text-xs text-muted-foreground">{c.email || ""} {c.phone ? `· ${c.phone}` : ""}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium text-emerald-700">{BRL(Number(c.monthly_fee))}/mês</span>
                  <Button size="icon" variant="ghost" onClick={() => del.mutate(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            ))}
            {(data as any[]).length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Nenhum cliente cadastrado</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LEADS / CAPTAÇÃO
// ---------------------------------------------------------------------------

const LEAD_STAGES = ["novo", "contato", "proposta", "negociacao", "ganho", "perdido"] as const;

function LeadsTab() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      if (error) throw error; return data;
    },
  });
  const [form, setForm] = useState({ name: "", source: "", stage: "novo", potential_value: "", next_action: "", email: "", phone: "" });
  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("leads").insert({
        name: form.name, source: form.source || null, stage: form.stage,
        potential_value: Number(form.potential_value || 0), next_action: form.next_action || null,
        email: form.email || null, phone: form.phone || null,
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Lead criado"); qc.invalidateQueries({ queryKey: ["leads"] });
      setForm({ name: "", source: "", stage: "novo", potential_value: "", next_action: "", email: "", phone: "" });
    },
    onError: (e: any) => toast.error(e.message),
  });
  const updateStage = useMutation({
    mutationFn: async ({ id, stage }: { id: string; stage: string }) => {
      const { error } = await supabase.from("leads").update({ stage }).eq("id", id); if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leads"] }),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("leads").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leads"] }),
  });

  const byStage = (s: string) => (data as any[]).filter((l) => l.stage === s);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Novo lead</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Input placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Origem (indicação, instagram...)" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
            <Input type="number" step="0.01" placeholder="Valor potencial (R$)" value={form.potential_value} onChange={(e) => setForm({ ...form, potential_value: e.target.value })} />
            <Input placeholder="E-mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input placeholder="Próxima ação" value={form.next_action} onChange={(e) => setForm({ ...form, next_action: e.target.value })} />
          </div>
          <Button className="mt-3" onClick={() => create.mutate()} disabled={!form.name || create.isPending}><Plus className="mr-2 h-4 w-4" />Adicionar lead</Button>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        {LEAD_STAGES.map((stage) => (
          <Card key={stage} className="bg-slate-100/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm capitalize">{stage}</CardTitle>
              <CardDescription className="text-xs">{byStage(stage).length} · {BRL(byStage(stage).reduce((s, l) => s + Number(l.potential_value || 0), 0))}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 px-3">
              {byStage(stage).map((l) => (
                <div key={l.id} className="rounded-md border bg-white p-2 text-xs shadow-sm">
                  <p className="truncate font-medium">{l.name}</p>
                  <p className="text-muted-foreground">{l.source || "—"} · {BRL(Number(l.potential_value))}</p>
                  {l.next_action && <p className="mt-1 text-muted-foreground">→ {l.next_action}</p>}
                  <div className="mt-2 flex items-center gap-1">
                    <Select value={l.stage} onValueChange={(v) => updateStage.mutate({ id: l.id, stage: v })}>
                      <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>{LEAD_STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => del.mutate(l.id)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AGENDA
// ---------------------------------------------------------------------------

function AgendaTab() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("appointments").select("*, clients(name)").order("starts_at");
      if (error) throw error; return data;
    },
  });
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => { const { data, error } = await supabase.from("clients").select("id, name").order("name"); if (error) throw error; return data; },
  });
  const [form, setForm] = useState({ title: "", starts_at: "", kind: "reuniao", client_id: "", notes: "" });
  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("appointments").insert({
        title: form.title, starts_at: new Date(form.starts_at).toISOString(),
        kind: form.kind, client_id: form.client_id || null, notes: form.notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Agendado"); qc.invalidateQueries({ queryKey: ["appointments"] });
      setForm({ title: "", starts_at: "", kind: "reuniao", client_id: "", notes: "" });
    },
    onError: (e: any) => toast.error(e.message),
  });
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: any) => { const { error } = await supabase.from("appointments").update({ status }).eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("appointments").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });

  const upcoming = (data as any[]).filter((a) => new Date(a.starts_at) >= new Date());
  const past = (data as any[]).filter((a) => new Date(a.starts_at) < new Date());

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
      <Card>
        <CardHeader><CardTitle>Novo compromisso</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>Título</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><Label>Data e hora</Label><Input type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} /></div>
          <div><Label>Tipo</Label>
            <Select value={form.kind} onValueChange={(v) => setForm({ ...form, kind: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="reuniao">Reunião</SelectItem>
                <SelectItem value="ligacao">Ligação</SelectItem>
                <SelectItem value="visita">Visita</SelectItem>
                <SelectItem value="entrega">Entrega</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Cliente</Label>
            <Select value={form.client_id || "none"} onValueChange={(v) => setForm({ ...form, client_id: v === "none" ? "" : v })}>
              <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— Nenhum —</SelectItem>
                {(clients as any[]).map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div><Label>Notas</Label><Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          <Button onClick={() => create.mutate()} disabled={!form.title || !form.starts_at || create.isPending} className="w-full"><Plus className="mr-2 h-4 w-4" />Agendar</Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader><CardTitle>Próximos ({upcoming.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {upcoming.map((a) => (
              <AgendaItem key={a.id} a={a} onStatus={(s) => updateStatus.mutate({ id: a.id, status: s })} onDelete={() => del.mutate(a.id)} />
            ))}
            {upcoming.length === 0 && <p className="text-sm text-muted-foreground">Sem compromissos próximos</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Histórico ({past.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2 max-h-[300px] overflow-y-auto">
            {past.slice(0, 30).map((a) => (
              <AgendaItem key={a.id} a={a} onStatus={(s) => updateStatus.mutate({ id: a.id, status: s })} onDelete={() => del.mutate(a.id)} />
            ))}
            {past.length === 0 && <p className="text-sm text-muted-foreground">Sem histórico</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AgendaItem({ a, onStatus, onDelete }: any) {
  return (
    <div className="flex items-start justify-between rounded-lg border p-3">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{a.title}</p>
        <p className="text-xs text-muted-foreground">{new Date(a.starts_at).toLocaleString("pt-BR")} · {a.kind} {a.clients?.name && `· ${a.clients.name}`}</p>
        {a.notes && <p className="mt-1 text-xs">{a.notes}</p>}
      </div>
      <div className="flex items-center gap-2">
        <Select value={a.status} onValueChange={onStatus}>
          <SelectTrigger className="h-7 w-32 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="agendado">Agendado</SelectItem>
            <SelectItem value="concluido">Concluído</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
        <Button size="icon" variant="ghost" onClick={onDelete}><Trash2 className="h-3.5 w-3.5" /></Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TASKS
// ---------------------------------------------------------------------------

function TasksTab() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => { const { data, error } = await supabase.from("tasks").select("*, clients(name)").order("due_on", { ascending: true, nullsFirst: false }); if (error) throw error; return data; },
  });
  const [form, setForm] = useState({ title: "", due_on: "", priority: "media", description: "" });
  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("tasks").insert({
        title: form.title, due_on: form.due_on || null, priority: form.priority, description: form.description || null,
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Tarefa criada"); qc.invalidateQueries({ queryKey: ["tasks"] }); setForm({ title: "", due_on: "", priority: "media", description: "" }); },
  });
  const toggle = useMutation({
    mutationFn: async (t: any) => {
      const newStatus = t.status === "concluida" ? "aberta" : "concluida";
      const { error } = await supabase.from("tasks").update({ status: newStatus, completed_at: newStatus === "concluida" ? new Date().toISOString() : null }).eq("id", t.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("tasks").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const open = (data as any[]).filter((t) => t.status !== "concluida");
  const done = (data as any[]).filter((t) => t.status === "concluida");
  const prioColor: any = { alta: "bg-rose-100 text-rose-800", media: "bg-amber-100 text-amber-800", baixa: "bg-slate-100 text-slate-700" };

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
      <Card>
        <CardHeader><CardTitle>Nova tarefa</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>Título</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><Label>Prazo</Label><Input type="date" value={form.due_on} onChange={(e) => setForm({ ...form, due_on: e.target.value })} /></div>
          <div><Label>Prioridade</Label>
            <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="alta">Alta</SelectItem><SelectItem value="media">Média</SelectItem><SelectItem value="baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Descrição</Label><Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <Button onClick={() => create.mutate()} disabled={!form.title || create.isPending} className="w-full"><Plus className="mr-2 h-4 w-4" />Criar</Button>
        </CardContent>
      </Card>
      <div className="space-y-4">
        <Card>
          <CardHeader><CardTitle>Em aberto ({open.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {open.map((t) => (
              <div key={t.id} className="flex items-start gap-3 rounded-lg border p-3">
                <input type="checkbox" className="mt-1" checked={false} onChange={() => toggle.mutate(t)} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.due_on ? `Prazo: ${new Date(t.due_on).toLocaleDateString("pt-BR")}` : "Sem prazo"}</p>
                  {t.description && <p className="mt-1 text-xs">{t.description}</p>}
                </div>
                <Badge className={prioColor[t.priority]}>{t.priority}</Badge>
                <Button size="icon" variant="ghost" onClick={() => del.mutate(t.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            ))}
            {open.length === 0 && <p className="text-sm text-muted-foreground">Nada em aberto 🎉</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Concluídas ({done.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2 max-h-[260px] overflow-y-auto">
            {done.map((t) => (
              <div key={t.id} className="flex items-start gap-3 rounded-lg border p-3 opacity-60">
                <input type="checkbox" className="mt-1" checked readOnly onClick={() => toggle.mutate(t)} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium line-through">{t.title}</p>
                  <p className="text-xs text-muted-foreground">Concluída em {t.completed_at ? new Date(t.completed_at).toLocaleDateString("pt-BR") : "—"}</p>
                </div>
                <Button size="icon" variant="ghost" onClick={() => del.mutate(t.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MARKETING — IA + Pollinations
// ---------------------------------------------------------------------------

function pollinationsUrl(prompt: string, seed: number = Math.floor(Math.random() * 1_000_000)) {
  const safe = encodeURIComponent(prompt.slice(0, 500));
  return `https://image.pollinations.ai/prompt/${safe}?width=1024&height=1024&nologo=true&seed=${seed}&model=flux`;
}

function MarketingTab() {
  const qc = useQueryClient();
  const aiFn = useServerFn(generateMarketingCopy);
  const [topic, setTopic] = useState("");
  const [channel, setChannel] = useState<"instagram" | "whatsapp" | "linkedin" | "facebook">("instagram");
  const [tone, setTone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ title: string; content: string; hashtags: string[]; image_prompt: string } | null>(null);
  const [imgUrl, setImgUrl] = useState<string>("");
  const [seed, setSeed] = useState(0);

  const { data: posts = [] } = useQuery({
    queryKey: ["mkt"],
    queryFn: async () => { const { data, error } = await supabase.from("marketing_posts").select("*").order("created_at", { ascending: false }); if (error) throw error; return data; },
  });

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true); setResult(null); setImgUrl("");
    try {
      const r = await aiFn({ data: { topic, channel, tone: tone || undefined } });
      setResult(r);
      const s = Math.floor(Math.random() * 1_000_000);
      setSeed(s);
      setImgUrl(pollinationsUrl(r.image_prompt, s));
    } catch (e: any) {
      toast.error(e?.message ?? "Falha");
    } finally { setLoading(false); }
  };

  const regenImage = () => {
    if (!result) return;
    const s = Math.floor(Math.random() * 1_000_000);
    setSeed(s);
    setImgUrl(pollinationsUrl(result.image_prompt, s));
  };

  const savePost = useMutation({
    mutationFn: async () => {
      if (!result) return;
      const fullContent = `${result.content}\n\n${result.hashtags.join(" ")}`.trim();
      const { error } = await supabase.from("marketing_posts").insert({
        title: result.title, channel, content: fullContent, image_url: imgUrl, image_prompt: result.image_prompt, status: "rascunho",
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Post salvo nos rascunhos"); qc.invalidateQueries({ queryKey: ["mkt"] }); },
    onError: (e: any) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("marketing_posts").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mkt"] }),
  });
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-emerald-600" />Gerar conteúdo com IA</CardTitle>
          <CardDescription>Copy + imagem (Pollinations.ai) prontos para Instagram, WhatsApp, LinkedIn ou Facebook.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div><Label>Tema / Mensagem</Label>
            <Textarea rows={3} placeholder="Ex.: Mostrar que escolhemos a melhor opção tributária para os clientes economizarem no Simples Nacional" value={topic} onChange={(e) => setTopic(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Canal</Label>
              <Select value={channel} onValueChange={(v: any) => setChannel(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Tom (opcional)</Label>
              <Input placeholder="Ex.: leve, técnico, urgente..." value={tone} onChange={(e) => setTone(e.target.value)} />
            </div>
          </div>
          <Button onClick={generate} disabled={loading || !topic.trim()} className="w-full">
            {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Gerar com IA
          </Button>

          {result && (
            <div className="mt-3 space-y-3 rounded-lg border bg-slate-50 p-3">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <Label className="text-xs">Título</Label>
                  <Button size="sm" variant="ghost" onClick={() => copy(result.title)}>Copiar</Button>
                </div>
                <p className="text-sm font-medium">{result.title}</p>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <Label className="text-xs">Conteúdo</Label>
                  <Button size="sm" variant="ghost" onClick={() => copy(`${result.content}\n\n${result.hashtags.join(" ")}`)}>Copiar tudo</Button>
                </div>
                <p className="whitespace-pre-wrap text-sm">{result.content}</p>
                {result.hashtags.length > 0 && <p className="mt-2 text-xs text-blue-700">{result.hashtags.join(" ")}</p>}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => savePost.mutate()} disabled={savePost.isPending}>Salvar rascunho</Button>
                <Button size="sm" variant="outline" onClick={regenImage}><RefreshCw className="mr-1 h-3 w-3" />Outra imagem</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Imagem gerada</CardTitle>
          <CardDescription>Pollinations.ai · sem necessidade de chave</CardDescription>
        </CardHeader>
        <CardContent>
          {imgUrl ? (
            <div className="space-y-2">
              <img src={imgUrl} alt="Geração" className="aspect-square w-full rounded-lg border object-cover" />
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <a href={imgUrl} download={`nobel-${seed}.jpg`} target="_blank" rel="noreferrer"><Download className="mr-1 h-3 w-3" />Baixar</a>
                </Button>
                <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(imgUrl); toast.success("URL copiada"); }}>Copiar URL</Button>
              </div>
              <p className="text-xs text-muted-foreground">Prompt: {result?.image_prompt}</p>
            </div>
          ) : (
            <div className="grid aspect-square place-items-center rounded-lg border-2 border-dashed text-sm text-muted-foreground">
              A imagem aparecerá aqui
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>Posts salvos ({(posts as any[]).length})</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {(posts as any[]).map((p) => (
              <div key={p.id} className="flex flex-col overflow-hidden rounded-lg border">
                {p.image_url && <img src={p.image_url} alt={p.title} className="aspect-square w-full object-cover" />}
                <div className="flex-1 space-y-2 p-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs capitalize">{p.channel}</Badge>
                    <Button size="icon" variant="ghost" onClick={() => del.mutate(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                  <p className="font-medium text-sm">{p.title}</p>
                  <p className="line-clamp-4 text-xs text-muted-foreground whitespace-pre-wrap">{p.content}</p>
                  <Button size="sm" variant="outline" className="w-full" onClick={() => copy(p.content || "")}>Copiar texto</Button>
                </div>
              </div>
            ))}
            {(posts as any[]).length === 0 && <p className="col-span-full py-6 text-center text-sm text-muted-foreground">Nenhum post salvo ainda</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
