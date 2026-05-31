import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "anthropic/claude-3.5-sonnet";

async function callAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const key = process.env.GROQ_API_KEY || process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("API Key ausente");

  // Se usar Groq, mudamos o endpoint se necessário, mas Lovable AI Gateway é o padrão recomendado.
  // Vamos priorizar a inteligência e encantar o cliente.
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
  if (res.status === 402) throw new Error("Créditos de IA esgotados. Adicione créditos no workspace.");
  if (!res.ok) throw new Error(`Erro IA (${res.status}): ${await res.text().catch(() => "")}`);

  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content ?? "";
}

/** Analisa snapshot financeiro e retorna insights + gargalos + recomendações. */
export const generateBusinessInsights = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        snapshot: z.string().min(1).max(8000),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const system =
      "Você é um consultor financeiro especialista em escritórios de contabilidade no Brasil. " +
      "Receba um snapshot dos números do escritório e retorne em português: " +
      "1) 3 insights principais sobre a saúde financeira; " +
      "2) Os 2-3 maiores gargalos identificados; " +
      "3) 3 ações práticas e priorizadas para aumentar a receita nos próximos 30 dias. " +
      "Seja direto, use bullet points e números concretos quando possível. Use markdown leve (## e -).";
    const content = await callAI(system, data.snapshot);
    return { content };
  });

/** Gera copy de post para redes sociais / WhatsApp + prompt de imagem casado. */
export const generateMarketingCopy = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        topic: z.string().min(2).max(500),
        channel: z.enum(["instagram", "whatsapp", "linkedin", "facebook"]),
        tone: z.string().max(80).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const system =
      "Você é um copywriter de marketing de elite especializado em B2B para contabilidade premium. " +
      "Gere um conteúdo de altíssimo nível, sofisticado, autoritário e educativo, focado em atrair clientes de alto ticket para a 'Contabilidade Nobel'. " +
      "Responda em JSON estrito com os campos: { \"title\": string, \"content\": string, \"hashtags\": string[], \"image_prompt\": string }. " +
      "O 'image_prompt' deve ser em inglês, altamente detalhado, descrevendo uma cena de fotografia corporativa cinematográfica, iluminação dramática, minimalista e luxuosa, sem texto na imagem. " +
      "NÃO use markdown no conteúdo, use apenas quebras de linha normais. Responda apenas o JSON.";
    const tone = data.tone ?? "profissional, confiável e acessível";
    const user = `Canal: ${data.channel}\nTom: ${tone}\nTema: ${data.topic}`;
    const raw = await callAI(system, user);
    // Tenta extrair JSON mesmo se vier com cercas
    const cleaned = raw.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
    let parsed: { title: string; content: string; hashtags: string[]; image_prompt: string };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {
        title: "Post sugerido",
        content: raw,
        hashtags: [],
        image_prompt: data.topic,
      };
    }
    return parsed;
  });
