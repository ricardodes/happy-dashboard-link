## Plano de Refatoração e Otimização - Nobel ERP Premium

Este plano visa transformar a estrutura atual (HTML/JS monolítico) em uma arquitetura moderna, escalável e de alta performance, focando na modularização e na robustez das integrações de IA.

### Etapa 1: Modularização e Estrutura de Código
*   **Divisão de Scripts:** Quebrar o `erp.script.js` (atualmente com +1500 linhas) em módulos específicos (ex: `ai-engine.js`, `ui-manager.js`, `data-service.js`).
*   **Componentização de UI:** Extrair elementos repetitivos do HTML (cards, botões, modais) para templates reutilizáveis ou componentes React para reduzir a duplicidade de código CSS/HTML.
*   **Gestão de Estado:** Implementar um padrão de observabilidade para que mudanças nos dados (ex: novos clientes) atualizem a interface automaticamente sem chamadas manuais a funções de renderização.

### Etapa 2: Otimização da Camada de Inteligência Artificial
*   **Padronização de Prompts:** Centralizar todos os prompts de IA em um arquivo de configuração, permitindo ajustes finos de "System Prompt" sem alterar a lógica de execução.
*   **Tratamento de Erros Multinível:** Refinar os fallbacks de processamento JSON para garantir que, mesmo em falhas parciais da API, o usuário receba insights úteis.
*   **Cache de Insights:** Implementar armazenamento local (SessionStorage) para resultados de análises de IA, evitando chamadas repetitivas e desnecessárias para o mesmo contexto.

### Etapa 3: Performance e UX (Interface do Usuário)
*   **Arquitetura CSS:** Migrar estilos inline e blocos de `<style>` dispersos para uma estrutura de variáveis CSS centralizada (Design Tokens), facilitando a manutenção do tema claro/escuro.
*   **Lazy Loading:** Implementar carregamento progressivo para as visões do sistema (views), carregando dados pesados (gráficos e tabelas longas) apenas quando a aba for ativada.
*   **Otimização de Assets:** Comprimir ícones e bibliotecas externas, garantindo que o tempo de carregamento inicial seja inferior a 1.5 segundos.

### Etapa 4: Integração e Segurança
*   **Sincronização com Alterdata:** Fortalecer a camada de integração com a API do Alterdata, incluindo logs de sincronização e tratamento de conflitos de dados.
*   **Validação de Dados:** Adicionar camadas de validação (Sanitization) em todos os inputs do sistema para prevenir falhas de segurança e garantir a integridade da base de dados.

### Detalhes Técnicos para Implementação
*   Uso de **ES Modules** para organização de arquivos.
*   Migração gradual para **Tailwind CSS** ou similar para padronização visual.
*   Implementação de **Unidade de Testes** para as funções críticas de cálculo tributário e parse de IA.
