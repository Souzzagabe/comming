@AGENTS.md

# CLAUDE.md — instruções específicas para o Claude Code

As regras do projeto estão no `AGENTS.md` (importado acima). Este arquivo só traz o que é específico do Claude Code.
Mantenha-o curto: se uma regra vale para qualquer agente, ela vai no `AGENTS.md`.

## Como trabalhar

- **Planeje antes de mexer em mais de 3 arquivos** (use o modo de plano) e mostre o plano em poucas linhas.
- **Uma tarefa por vez**, focada (ex.: "ajustar o header no mobile"). Evite pedidos do tipo "refaz tudo".
- **Leia antes de editar.** Para CSS, procure a seção em `globals.css` pelos comentários `/* ─── Nome ─── */` em vez de abrir o arquivo inteiro.
- **Prefira editar arquivos existentes** a criar novos. Só crie arquivo quando houver um componente ou responsabilidade nova.
- Use os padrões que já existem (custom properties via `ref`, `@supports` para scroll-driven, classes por seção) antes de inventar outro.
- Se faltar informação de conteúdo (texto, número, cargo), **pergunte** em vez de preencher.

## Verificação

Depois de cada mudança relevante:

1. Rode `npm run build` e `npm run lint` e corrija o que aparecer.
2. Para mudanças visuais, confirme em 390 px e em 1440 px (e 320 px / 2560 px se mexer em layout).
3. Resuma no final: o que mudou, quais arquivos, o que **não** foi testado.

## Contexto que costuma ajudar

- Prints e o código real do componente valem mais do que descrições. Peça-os quando houver dúvida visual.
- Ao corrigir bug visual, ache a **causa** (ex.: precedência de CSS fora de `@layer`) em vez de empilhar `!important`.

## Subagentes e comandos (opcional)

Se quiser dividir papéis, crie em `.claude/agents/`:

- `revisor-a11y.md`: revisa foco, `aria-*`, contraste e `prefers-reduced-motion` nas mudanças recentes.
- `revisor-performance.md`: procura imagens pesadas, libs novas, loops sem pausa e re-renders por frame.
- `teste-responsivo.md`: confere as larguras 320 / 390 / 768 / 1024 / 1440 / 2560 e relata overflow.

E em `.claude/commands/` (slash commands):

- `/revisar`: roda o lint, o build e chama os revisores acima.
- `/novo-componente`: cria um componente seguindo os padrões do `AGENTS.md` (i18n, a11y, reduced motion).