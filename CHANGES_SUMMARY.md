# Resumo das Alterações - Avaliação Gratuita via IA

Este documento resume as alterações feitas para implementar a funcionalidade de avaliação gratuita feita por IA antes do pagamento via Pix.

## Objetivo
Implementar que o botão "Fazer Avaliação Gratuita" inicia uma avaliação feita por IA gratuita antes de exigir pagamento via Pix.

## Alterações realizadas

### 1. Novos componentes criados
- `src/components/FreeAssessment.tsx` - Componente para captura de imagem e chamada da análise gratuita
- `src/components/FreeReport.tsx` - Componente para exibição dos resultados da análise gratuita com opção de upgrade

### 2. Novas rotas de API criadas
- `src/app/api/analyze-free/route.ts` - Endpoint para análise gratuita de pele (não requer pagamento)

### 3. Modificações em arquivos existentes
- `src/app/page.tsx`:
  - Adicionado novos passos ao tipo `Step`: 'freeAssessment' e 'freeReport'
  - Adicionado estado `freeAnalysisResult` para armazenar resultados da análise gratuita
  - Adicionado handler `handleStartFreeAssessment` para iniciar o fluxo gratuito
  - Atualizado o componente `LandingPage` para aceitar dois handlers: `onStart` (para pagamento) e `onStartFreeAssessment` (para avaliação gratuita)
  - Alterado o botão "Fazer Avaliação Gratuita" para usar `onStartFreeAssessment`
  - Atualizado o CTA bar móvel para também usar `onStartFreeAssessment`
  - Adicionado rotas para os novos passos 'freeAssessment' e 'freeReport'
  - Importado os novos componentes `FreeAssessment` e `FreeReport`

### 4. Fluxo de usuário atualizado
**Fluxo Original:**
Landing → Payment → Scan → Report

**Novo Fluxo (para botão "Fazer Avaliação Gratuita"):**
Landing → Free Assessment → Free Report → [Opção de Upgrade para Pagamento]

### 5. Funcionalidade da Análise Gratuita
- Permite upload de foto ou captura via câmera
- Chama API `/api/analyze-free` que não requer verificação de pagamento
- Fornece análise básica com:
  - Métricas limitadas (rugas, manchas, vermelhidão, textura, oleosidade)
  - Rotina básica de cuidados (limpeza, hidratante, protetor solar)
  - Resumo simplificado dos resultados
- Após visualização, oferece opção de upgrade para análise completa via pagamento Pix

### 6. Diferenças entre Análise Gratuita e Análise Paga
| Característica | Análise Gratuita | Análise Paga |
|----------------|------------------|--------------|
| Requer pagamento | Não | Sim (R$ 19,90 via Pix) |
| Métricas disponíveis | Básicas (faixas limitadas) | Completa (faixas completas) |
| Personalização da rotina | Básica (3 passos fixos) | Personalizada baseada na análise |
| Detalhes do resumo | Simplificado | Detalhado e específico |
| Opção de upgrade | Disponível após resultados | Não aplicável |

## Como Testar
1. Execute o aplicativo normalmente: `npm run dev`
2. Na página inicial, clique no botão "Fazer Avaliação Gratuita" (na seção hero ou no CTA bar móvel)
3. Faça upload de uma foto ou tire uma selfie
4. Clique em "Iniciar Análise Gratuita"
5. Visualize os resultados básicos da análise
6. Opção de upgrade para análise completa estará disponível

## Observações Importantes
- A análise gratuita usa uma versão limitada da mesma lógica de IA utilizada na análise paga
- Nenhuma imagem é armazenada permanentemente - todo processamento ocorre na memória
- A transição para o fluxo de pagamento mantém o fluxo original intacto para usuários que escolhem o botão "Iniciar Análise" no header