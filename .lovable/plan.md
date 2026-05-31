# Unificação Landing + ERP Nobel

## Estrutura de rotas

```
/              → Landing pública (do index.html)
/login         → Tela de login (email/senha)
/app           → Dashboard ERP (do app.html) — protegido
```

CTA "Acessar Plataforma" da landing → `/login` → `/app`.

## Estratégia de portagem (pragmática)

Converter 4600 linhas de HTML/CSS/JS artesanal para JSX puro consumiria muito sem ganho visual. Em vez disso:

1. **CSS** dos dois arquivos → movido para `src/styles/landing.css` e `src/styles/erp.css` (importados só nas respectivas rotas). Variáveis verde Nobel (`#0a5c3a`, `#00b86b`) também viram tokens em `src/styles.css`.
2. **Markup** (`<body>`) → inserido via `dangerouslySetInnerHTML` num container React por rota. Mantém fidelidade 1:1 com o HTML original.
3. **Scripts** (GSAP, Chart.js, Lucide) → carregados via `<script>` tags no `head()` da rota + inicialização em `useEffect`.
4. **Imagens/logos** referenciadas no HTML → copiadas pra `public/`.

Isso entrega o design exato dos dois HTMLs, com roteamento React real e auth de verdade.

## Autenticação (Lovable Cloud)

- Email/senha (sem perfil extra — só `auth.users`).
- Rota `/login` pública com signup + signin.
- Layout `_authenticated` protege `/app` via `beforeLoad` + redirect pra `/login`.
- Listener `onAuthStateChange` no root.
- Botão "Sair" no header do ERP.

## Arquivos a criar/editar

- `src/routes/index.tsx` — landing (substitui placeholder)
- `src/routes/login.tsx` — form de login/cadastro
- `src/routes/_authenticated.tsx` — guard
- `src/routes/_authenticated/app.tsx` — ERP
- `src/styles/landing.css`, `src/styles/erp.css`
- `src/routes/__root.tsx` — adicionar listener de auth
- Habilitar Lovable Cloud

## O que NÃO vai ser feito agora

- Conectar os dados do ERP a tabelas reais (continuam mockados como no HTML original).
- Refatorar componentes do ERP em React idiomático (fica como melhoria futura).
- Múltiplas seções da landing como rotas separadas (é uma single-page com âncoras, como o original).

Confirma que posso seguir assim?
