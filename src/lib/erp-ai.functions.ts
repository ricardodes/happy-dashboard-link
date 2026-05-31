import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-pro";

async function callAI(systemPrompt: string, userPrompt: string, customKey?: string): Promise<string> {
  const key = customKey || process.env.GROQ_API_KEY || process.env.LOVABLE_API_KEY;
  if (!key || key === "sk-••••••••••••••••••••••••") throw new Error("API Key inválida ou ausente. Configure na Central de IA.");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
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

export const generateBusinessInsights = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ snapshot: z.string(), apiKey: z.string().optional() }).parse(input)
  )
  .handler(async ({ data }) => {
    const system = "Consultor financeiro contábil. Insights, gargalos e ações.";
    const content = await callAI(system, data.snapshot, data.apiKey);
    return { content };
  });

export const generateMarketingCopy = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ topic: z.string(), channel: z.string(), tone: z.string().optional(), apiKey: z.string().optional() }).parse(input)
  )
  .handler(async ({ data }) => {
    const system = "Copywriter B2B contabilidade premium. JSON: {title, content, hashtags, image_prompt, cta}.";
    const user = `Canal: ${data.channel}\nTom: ${data.tone || 'premium'}\nTema: ${data.topic}`;
    const raw = await callAI(system, user, data.apiKey);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : raw);
  });

export const searchProspectsAI = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ query: z.string(), city: z.string(), category: z.string(), apiKey: z.string().optional() }).parse(input)
  )
  .handler(async ({ data }) => {
    const system = "Você é um especialista em prospecção B2B. Gere uma lista de 15 empresas REAIS ou ALTAMENTE PROVÁVEIS no Norte de Minas (especialmente Montes Claros e região). " +
      "Responda APENAS um JSON Array: [{\"nome\": string, \"cat\": string, \"cidade\": string, \"endereco\": string, \"tel\": string, \"score\": number, \"regime\": string, \"oportunidade\": \"alta\"|\"media\"}]. " +
      "Foque em empresas de médio/grande porte, clínicas e indústrias.";
    const user = `Busca: ${data.query}. Cidade: ${data.city}. Categoria: ${data.category}.`;
    const raw = await callAI(system, user, data.apiKey);
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : "[]");
  });
