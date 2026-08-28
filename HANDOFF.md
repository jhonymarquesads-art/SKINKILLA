# Handoff do projeto

## Estado salvo

- Branch de trabalho: `DEV`
- Último commit funcional: `64f8648` (`fix: restore Next.js project configuration`)
- Repositório: https://github.com/jhonymarquesads-art/SKINKILLA.git
- O fluxo local estava limpo e sincronizado com `origin/DEV` antes deste arquivo.

## Fluxo de avaliação gratuita

1. `src/app/page.tsx` abre `FreeAssessment` e navega para `freeReport`.
2. `src/components/FreeAssessment.tsx` recebe a selfie e chama `POST /api/analyze-free`.
3. `src/app/api/analyze-free/route.ts` tenta analisar a selfie com Gemini Vision usando `GEMINI_API_KEY`; sem a variável, usa métricas simuladas, rotina adaptada, prioridades e plano de skin care com faixa de orçamento.
4. `src/components/FreeReport.tsx` exibe métricas, rotina, produtos recomendados e investimento inicial estimado.
5. A primeira avaliação também gera nota atual, potencial estimado, nível, `Glow Points` e próximo objetivo; o resultado é salvo em `localStorage` como `skinkilla:first-assessment`.

O resultado gratuito é uma orientação geral e não substitui avaliação dermatológica. A resposta informa `source: gemini` quando a análise real é usada e `source: fallback` quando não há chave ou a API falha.

## Validação e execução

- `npx tsc --noEmit` passa.
- `npm run dev` inicia o Next.js em `http://localhost:3000`.
- `npm run lint` existe, mas ainda aponta problemas de lint antigos no projeto.
- As alterações experimentais do Claude Code estão protegidas em `stash@{0}` e não foram incorporadas ao código funcional.
- O fluxo pago continua em `PaymentModal`, `CameraScanner`, `/api/analyze` e `SkinReport`.

## Próximo passo recomendado

Configurar `GEMINI_API_KEY` no `.env.local` para ativar a análise real; nunca publicar esse valor no GitHub.
