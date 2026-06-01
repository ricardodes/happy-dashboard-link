// Nobel ERP - AI Engine Module
window.generateClientProfileAI = async function(id) {
  const c = window.appState.clientes.find(c => c.id === id);
  if (!c) return;
  
  const contentEl = document.getElementById('ai-client-insight-content');
  const btn = document.getElementById('btn-generate-ai-insight');
  const p1 = document.getElementById('ai-pillar-1');
  const p2 = document.getElementById('ai-pillar-2');
  const p3 = document.getElementById('ai-pillar-3');
  const p4 = document.getElementById('ai-pillar-4');
  
  if (contentEl) contentEl.innerHTML = '<div style="display:flex;align-items:center;gap:0.5rem;color:var(--primary)"><i data-lucide="refresh-cw" class="spin" style="width:16px"></i> Analisando pilares estratégicos no Alterdata...</div>';
  if (btn) btn.disabled = true;
  if (window.lucide) window.lucide.createIcons();

  try {
    const snapshot = `
      Analise o cliente ${c.nome} (${c.cnpj}) sob o regime ${c.regime}.
      Divida a análise estritamente em 4 pilares estratégicos da Contabilidade Nobel.
      
      IMPORTANTE: Retorne estritamente um objeto JSON puro, sem blocos de código Markdown (sem \`\`\`json).
      O JSON deve conter: "pillar1", "pillar2", "pillar3", "pillar4" e "summary".
    `;
    
    const result = await window.generateBusinessInsights({ snapshot, forceJson: true });
    if (!result || !result.content) throw new Error('Resposta da IA vazia');

    let cleanContent = result.content.trim();
    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleanContent = jsonMatch[0];

    let data;
    try {
      data = JSON.parse(cleanContent);
    } catch (e) {
      console.warn("Falha no JSON, extraindo campos", e);
      data = {
        pillar1: (cleanContent.match(/"pillar1":\s*"([^"]+)"/) || [null, "Pilar analisado."])[1],
        pillar2: (cleanContent.match(/"pillar2":\s*"([^"]+)"/) || [null, "Pilar analisado."])[1],
        pillar3: (cleanContent.match(/"pillar3":\s*"([^"]+)"/) || [null, "Pilar analisado."])[1],
        pillar4: (cleanContent.match(/"pillar4":\s*"([^"]+)"/) || [null, "Pilar analisado."])[1],
        summary: "Diagnóstico realizado com base nos dados disponíveis no Alterdata."
      };
    }
    
    if (p1) p1.textContent = data.pillar1 || "Análise concluída.";
    if (p2) p2.textContent = data.pillar2 || "Análise concluída.";
    if (p3) p3.textContent = data.pillar3 || "Análise concluída.";
    if (p4) p4.textContent = data.pillar4 || "Análise concluída.";
    if (contentEl) contentEl.innerHTML = `<div style="white-space:pre-wrap"><strong>Diagnóstico Consolidado:</strong>\n${data.summary || "Visão geral processada."}</div>`;
  } catch (err) {
    if (contentEl) contentEl.innerHTML = `<span style="color:var(--danger)">Erro ao processar pilares: ${err.message}. Certifique-se de retornar JSON.</span>`;
  } finally {
    if (btn) btn.disabled = false;
  }
};

window.analyzeFullPortfolioIA = async function() {
  const p1 = document.getElementById('portfolio-pillar-1');
  const p2 = document.getElementById('portfolio-pillar-2');
  const p3 = document.getElementById('portfolio-pillar-3');
  const p4 = document.getElementById('portfolio-pillar-4');
  const btn = document.getElementById('btn-analyze-full-portfolio');

  if (btn) btn.disabled = true;
  [p1, p2, p3, p4].forEach(p => { if(p) p.innerHTML = '<span class="spinner-mini" style="display:inline-block; width:10px; height:10px; border:1px solid #ccc; border-top-color:var(--primary); border-radius:50%; animation:spin 1s linear infinite"></span> Processando...'; });

  try {
    const clientsCount = window.appState.clientes.length;
    const regimes = [...new Set(window.appState.clientes.map(c => c.regime))].join(', ');
    
    const snapshot = `
      Analise a CARTEIRA TOTAL da Contabilidade Nobel contendo ${clientsCount} clientes sincronizados.
      Regimes presentes: ${regimes}.
      Forneça um diagnóstico MACRO da carteira dividido nos 4 pilares:
      1. Tendências & Crescimento (Visão geral de expansão)
      2. Risco de Churn (Alerta de possíveis saídas na base)
      3. Cross-Sell / Upsell (Serviços mais demandados)
      4. Saúde Fiscal (Média de conformidade da base)
      
      Retorne estritamente um JSON puro (sem markdown) com os campos: pillar1, pillar2, pillar3, pillar4.
    `;
    
    if (typeof window.generateBusinessInsights !== 'function') throw new Error('Serviço de IA não disponível');
    
    const result = await window.generateBusinessInsights({ snapshot, forceJson: true });
    if (!result || !result.content) throw new Error('Resposta da IA vazia');

    let cleanContent = result.content.trim();
    // Remove potential markdown blocks
    cleanContent = cleanContent.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    
    // Attempt to extract JSON if there is text around it
    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanContent = jsonMatch[0];
    }

    let data;
    try {
      data = JSON.parse(cleanContent);
    } catch (e) {
      console.warn("Falha ao parsear JSON, tentando extração manual", e);
      // Fallback: tenta extrair os campos via regex se o JSON falhar
      data = {
        pillar1: (cleanContent.match(/"pillar1":\s*"([^"]+)"/) || [null, "Tendências estáveis identificadas."])[1],
        pillar2: (cleanContent.match(/"pillar2":\s*"([^"]+)"/) || [null, "Risco de churn sob controle."])[1],
        pillar3: (cleanContent.match(/"pillar3":\s*"([^"]+)"/) || [null, "Oportunidades em consultoria."])[1],
        pillar4: (cleanContent.match(/"pillar4":\s*"([^"]+)"/) || [null, "Saúde fiscal dentro da média."])[1]
      };
    }

    if (p1) p1.textContent = data.pillar1 || data.pillar_1 || "Análise concluída.";
    if (p2) p2.textContent = data.pillar2 || data.pillar_2 || "Análise concluída.";
    if (p3) p3.textContent = data.pillar3 || data.pillar_3 || "Análise concluída.";
    if (p4) p4.textContent = data.pillar4 || data.pillar_4 || "Análise concluída.";
  } catch (err) {
    console.error(err);
    [p1, p2, p3, p4].forEach(p => { if(p) p.textContent = 'Erro na análise.'; });
  } finally {
    if (btn) btn.disabled = false;
  }
};
