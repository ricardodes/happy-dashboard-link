import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const LOVABLE_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const LOVABLE_MODEL = "google/gemini-2.5-flash";
const GROQ_GATEWAY = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

async function callAI(systemPrompt: string, userPrompt: string, customKey?: string): Promise<string> {
  const isGroq = !!customKey && customKey.startsWith("gsk_");
  const key = customKey || process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("API Key ausente. Configure na Central de IA.");

  const url = isGroq ? GROQ_GATEWAY : LOVABLE_GATEWAY;
  const model = isGroq ? GROQ_MODEL : LOVABLE_MODEL;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (res.status === 429) throw new Error("Limite de IA atingido. Tente novamente em alguns minutos.");
  if (res.status === 402) throw new Error("Créditos de IA esgotados.");
  if (!res.ok) throw new Error(`Erro IA (${res.status}): ${await res.text().catch(() => "")}`);

  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content ?? "";
}

const insightsSchema = z.object({ snapshot: z.string().default(""), apiKey: z.string().optional() });
const marketingSchema = z.object({
  topic: z.string().default("Contabilidade Estratégica"),
  channel: z.string().default("instagram"),
  tone: z.string().optional(),
  apiKey: z.string().optional(),
});
const prospectsSchema = z.object({
  query: z.string().default(""),
  city: z.string().default("Montes Claros"),
  category: z.string().default(""),
  apiKey: z.string().optional(),
});

export const generateBusinessInsights = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => insightsSchema.parse(input ?? {}))
  .handler(async ({ data }) => {
    const system = "Consultor financeiro contábil. Insights, gargalos e ações.";
    const content = await callAI(system, data.snapshot, data.apiKey);
    return { content };
  });

export const generateMarketingCopy = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => marketingSchema.parse(input ?? {}))
  .handler(async ({ data }) => {
    const system = "Copywriter B2B contabilidade premium. Responda APENAS JSON válido: {\"title\":string,\"content\":string,\"hashtags\":string,\"image_prompt\":string,\"cta\":string}.";
    const user = `Canal: ${data.channel}\nTom: ${data.tone || 'premium'}\nTema: ${data.topic}`;
    const raw = await callAI(system, user, data.apiKey);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    try {
      return JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    } catch {
      return { title: data.topic, content: raw, hashtags: "#contabilidade", image_prompt: data.topic, cta: "Fale conosco" };
    }
  });

export const searchProspectsAI = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => prospectsSchema.parse(input ?? {}))
  .handler(async ({ data }) => {
    const system = "Especialista em prospecção B2B no Norte de Minas (Montes Claros e região). " +
      "Responda APENAS JSON Array com 15 empresas reais/prováveis: [{\"nome\":string,\"cat\":string,\"cidade\":string,\"endereco\":string,\"tel\":string,\"score\":number,\"regime\":string,\"oportunidade\":\"alta\"|\"media\"}].";
    const user = `Busca: ${data.query}. Cidade: ${data.city}. Categoria: ${data.category}.`;
    const raw = await callAI(system, user, data.apiKey);
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    try {
      return JSON.parse(jsonMatch ? jsonMatch[0] : "[]");
    } catch {
      return [];
    }
  });
