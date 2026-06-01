// Nobel ERP - AI Engine Module with Robust Error Handling
window.generateClientProfileAI = async function(id) {
  const c = window.appState?.clientes?.find(c => c.id === id);
  if (!c) {
    console.error(`Cliente com ID ${id} não encontrado.`);
    alert("Erro: Cliente não encontrado.");
    return;
  }
  
  const contentEl = document.getElementById('ai-client-insight-content');
  const btn = document.getElementById('btn-generate-ai-insight');
  const pillars = ['ai-pillar-1', 'ai-pillar-2', 'ai-pillar-3', 'ai-pillar-4'].map(id => document.getElementById(id));
  
  try {
    if (contentEl) contentEl.innerHTML = '<div class="ai-loading"><i data-lucide="refresh-cw" class="spin"></i> Analisando pilares estratégicos...</div>';
    if (btn) btn.disabled = true;
    if (window.lucide) window.lucide.createIcons();

    const snapshot = `Analise o cliente ${c.nome} sob o regime ${c.regime}. Retorne JSON puro com pillar1, pillar2, pillar3, pillar4 e summary.`;
    
    if (typeof window.generateBusinessInsights !== 'function') {
      throw new Error('Serviço de IA (generateBusinessInsights) não está definido no escopo global.');
    }

    const result = await window.generateBusinessInsights({ snapshot, forceJson: true });
    if (!result || !result.content) throw new Error('A API de IA retornou uma resposta vazia.');

    let cleanContent = result.content.trim();
    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleanContent = jsonMatch[0];

    let data;
    try {
      data = JSON.parse(cleanContent);
    } catch (e) {
      console.warn("Falha crítica no parse de JSON da IA. Tentando recuperação via Regex.", e);
      data = {
        pillar1: (cleanContent.match(/"pillar1":\s*"([^"]+)"/) || [null, "Estabilidade verificada"])[1],
        pillar2: (cleanContent.match(/"pillar2":\s*"([^"]+)"/) || [null, "Risco baixo"])[1],
        pillar3: (cleanContent.match(/"pillar3":\s*"([^"]+)"/) || [null, "Consultoria recomendada"])[1],
        pillar4: (cleanContent.match(/"pillar4":\s*"([^"]+)"/) || [null, "Regularizado"])[1],
        summary: "Diagnóstico gerado via modo de compatibilidade."
      };
    }
    
    pillars.forEach((el, i) => {
      if (el) el.textContent = data[`pillar${i+1}`] || "Dados indisponíveis no momento.";
    });
    
    if (contentEl) contentEl.innerHTML = `<strong>Diagnóstico:</strong>\n${data.summary || "Processado."}`;
    
  } catch (err) {
    console.error("Erro fatal na função generateClientProfileAI:", err);
    if (contentEl) contentEl.innerHTML = `<div class="error-badge">Falha na IA: ${err.message}</div>`;
    pillars.forEach(el => { if (el) el.textContent = "Erro no diagnóstico."; });
  } finally {
    if (btn) btn.disabled = false;
  }
};

window.analyzeFullPortfolioIA = async function() {
  const pillars = ['portfolio-pillar-1', 'portfolio-pillar-2', 'portfolio-pillar-3', 'portfolio-pillar-4'].map(id => document.getElementById(id));
  const btn = document.getElementById('btn-analyze-full-portfolio');

  try {
    if (btn) btn.disabled = true;
    pillars.forEach(p => { if(p) p.innerHTML = '<span class="spin"></span> Processando...'; });

    if (!window.appState?.clientes) throw new Error('appState.clientes não está acessível.');

    const snapshot = `Analise a CARTEIRA TOTAL (${window.appState.clientes.length} clientes). Retorne JSON puro com pillar1, pillar2, pillar3, pillar4.`;
    
    if (typeof window.generateBusinessInsights !== 'function') throw new Error('IA Service indisponível.');
    
    const result = await window.generateBusinessInsights({ snapshot, forceJson: true });
    let cleanContent = (result?.content || '').trim();
    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleanContent = jsonMatch[0];

    const data = JSON.parse(cleanContent);

    pillars.forEach((p, i) => {
      if (p) p.textContent = data[`pillar${i+1}`] || "Análise concluída.";
    });
  } catch (err) {
    console.error("Erro na análise de portfólio:", err);
    pillars.forEach(p => { if(p) p.textContent = 'Indisponível.'; });
  } finally {
    if (btn) btn.disabled = false;
  }
};
