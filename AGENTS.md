# AGENTS.md — Portfólio de Gabriel de Souza

Instruções para qualquer agente de IA (Claude Code, Cursor, Copilot, Codex...).
Leia antes de editar. Itens marcados com **(confirmar)** foram inferidos: ajuste se estiverem diferentes no projeto.

## Visão geral

Portfólio pessoal bilíngue (PT/EN) em **Next.js (App Router) + React + TypeScript + Tailwind CSS v4**.
Identidade: paleta **amarelo e preto**, tipografia forte, animações com propósito.
Prioridades, nesta ordem: **acessibilidade → performance → SEO → experiência visual**.

## Comandos (confirmar)

```bash
npm run dev     # servidor local em http://localhost:3000
npm run build   # build de produção: rode antes de dizer que terminou
npm run lint    # ESLint
```

Se o projeto usar pnpm ou yarn, troque `npm run` pelo equivalente.

## Estrutura (confirmar os caminhos)

```
app/
  layout.tsx, page.tsx        # page monta: Header, Hero, About, Experience, Services, Contact, Footer
  globals.css                 # tema (variáveis CSS), animações e estilos por seção
  contexts/i18n-context       # useI18n() → { t, locale, setLocale }
  components/                 # Header, Hero, About, Experience, Services, Contact, Footer,
                              # PageLoader, StoneField, WhatsAppFab, JsonLd
  api/contact/                # rota do formulário
public/                       # imagens, shards/shards.webp, icons/
```

Ids das seções (usados pela navegação): `home`, `sobre`, `experiencia`, `servicos`, `contato`.

## Decisões de arquitetura (não desfazer sem perguntar)

- **Sem APIs ou serviços externos novos.** Conteúdo é estático e local. Única exceção existente: formulário de contato (`/api/contact` + Cloudflare Turnstile).
- **Animações de scroll em CSS puro** (`animation-timeline: view()` / `scroll()`), sempre dentro de `@supports` e com fallback sem animação. Não usar framer-motion em código novo.
- **Pedras 3D**: `StoneField.tsx` em WebGL2 puro (sem three.js). Sem WebGL2, o CSS mostra os sprites de `shards.webp`.
- **Tema** via variáveis CSS: `--color-primary` (amarelo), `--color-background`, `--color-surface`, `--color-card`, `--color-border`, `--color-foreground`, `--color-muted`. Não escrever cores soltas quando existir variável.
- **Navegação** com âncoras `<a href="#id">`; o scroll suave vem de `scroll-behavior` no CSS.
- **Loader**: o `PageLoader` adiciona `body.page-ready`; as animações de entrada do hero e do header dependem dessa classe. Manter o fallback `@media (scripting: none)`.
- `lucide-react` está numa versão que ainda tem os ícones de marca (Github, Linkedin, Instagram). Não atualizar sem substituí-los.

## Regras de código

- TypeScript estrito. Evite `any`; se for inevitável, comente o motivo.
- `"use client"` só quando houver hooks ou eventos. `JsonLd` é componente de servidor.
- **Todo texto novo visível vai para o dicionário i18n, em PT e EN.** Hoje há textos fixos em `About` (cards), `Experience` (`JOBS`) e `Footer`; ao mexer neles, prefira migrar.
- **Nunca invente conteúdo**: textos de marketing, números, cargos, métricas ou depoimentos. Se faltar dado, pergunte ou deixe `TODO`.
- Em interações de alta frequência (mouse, scroll, animação), **não use `setState` por frame**. Escreva custom properties via `ref` (padrão do Hero, StoneField e PageLoader).
- **Armadilha de CSS:** regras sem `@layer` em `globals.css` **vencem** utilitários do Tailwind, mesmo com menor especificidade. Exemplo: `main h2 { text-shadow }` ignora `[text-shadow:none]`; use a classe `.heading-flat`. Para sobrescrever, crie uma classe no `globals.css`.
- Mantenha o estilo existente: nomes de classe por seção (`.hero-*`, `.about-*`, `.services-*`, `.site-*`), seções separadas por comentários `/* ─── Nome ─── */`.

## Acessibilidade (obrigatório)

- Decorativos com `aria-hidden="true"`; ícones dentro de links/botões também.
- Foco visível em todo elemento interativo; alvos de toque ≥ 44px quando possível.
- Respeitar `prefers-reduced-motion` em toda animação nova (e `@media (scripting: none)` quando o conteúdo depende de JS para aparecer).
- Links externos: `target="_blank"` com `rel="noopener noreferrer"` e aviso "(abre em nova aba)" para leitor de tela.
- Hierarquia de títulos coerente (um `h1`, `h2` por seção).

## Performance

- Meta: Lighthouse mobile ≥ 90. O card do About mostra `LIGHTHOUSE_MOBILE`: atualize o número **só depois de medir**.
- Imagens com `next/image`; `priority` apenas na imagem do hero; preferir AVIF/WebP; nomes de arquivo e `alt` descritivos.
- Loops infinitos devem pausar fora da tela (IntersectionObserver) e com a aba escondida.
- Nova dependência = justificar tamanho e ganho antes de instalar.

## Antes de dizer "pronto"

1. `npm run build` e `npm run lint` passam sem erros.
2. Sem overflow horizontal em **320, 390, 768, 1024, 1440 e 2560 px**, e em celular deitado (844×390).
3. Teclado: dá para navegar tudo e o foco aparece. Teste também com `prefers-reduced-motion`.
4. PT/EN alternam; formulário (honeypot + Turnstile) continua funcionando.
5. Se existirem testes, rode-os.

## Limites

**Sempre:** ler o arquivo antes de editar; fazer mudanças pequenas e focadas; explicar o que mudou e por quê.

**Perguntar antes:** adicionar dependência; alterar `/api/contact`; mudar paleta, logo ou identidade; apagar arquivos; mexer em variáveis de ambiente.

**Nunca:** commitar `.env` ou chaves secretas (a `NEXT_PUBLIC_TURNSTILE_SITE_KEY` é pública; a chave secreta fica só no servidor); expor e-mail ou telefone em novos lugares sem pedido; remover recursos de acessibilidade para "limpar" o código.

## Commits (confirmar a convenção)

Conventional Commits em português, no imperativo: `feat: adiciona seção de experiência`, `fix: corrige sombra no título de serviços`, `perf:`, `refactor:`, `docs:`.

## Fatos do conteúdo (para não errar)

- Nome: Gabriel de Souza · Porto Alegre, RS · Desenvolvedor Full Stack com foco em Front-end.
- Site: https://www.souzzagabe.com.br · GitHub `Souzzagabe` · LinkedIn `gabriel-souza-web` · Instagram `souzzagabe`.
- Experiência (fonte: `JOBS` em `Experience.tsx`): Target.IT (jan/2025 → atual), Genesis Digital (jun/2024 → jan/2025), Lacrei Saúde (mar/2024 → jun/2024).