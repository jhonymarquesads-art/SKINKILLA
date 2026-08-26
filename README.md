# Análise Facial de Pele - Avaliação Gratuita com IA

Este é um protótipo de aplicação para análise facial de pele que oferece uma avaliação gratuita feita por IA antes do pagamento via Pix.

## Funcionalidades

- Botão "Fazer Avaliação Gratuita" que inicia uma análise simulada de pele por IA
- Exibe resultados mockados de hidratação, oleosidade, manchas, rugas e score geral
- Após a análise gratuita, apresenta informações para pagamento via Pix para acesso ao plano completo
- Interface responsiva e amigável

## Como usar

1. Abra o arquivo `index.html` em qualquer navegador moderno
2. Clique no botão "Fazer Avaliação Gratuita"
3. Aguarde a análise simulada (2 segundos)
4. Visualize os resultados da análise
5. Após os resultados, aparecerão as instruções para pagamento via Pix

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript Vanilla (sem frameworks)

## Observações importantes

- Esta é uma versão de protótipo com dados mockados. Para uma versão real, seria necessário:
  - Integrar com um serviço real de IA para análise facial (como AWS Rekognition, Google Cloud Vision, ou um modelo customizado)
  - Implementar autenticação e armazenamento seguro de dados
  - Integrar com uma gateway de pagamento Pix real (como Mercado Pago, PagSeguro, ou API do Banco Central)
  - Adicionar validação de upload de imagem e processamento real

## Estrutura dos arquivos

```
facial-skin-analysis/
├── index.html      # Página principal com interface e lógica
└── README.md       # Este arquivo
```

## Personalização

Para adaptar esta solução para uso real:

1. Substitua a função `startAssessment()` por uma chamada real à sua API de IA
2. Implemente o upload e processamento de imagem facial
3. Substitua os dados mockados pelos resultados reais da análise
4. Integre com uma API de pagamento Pix válida
5. Adicione validações de segurança e tratamento de erros

## Licença

Este projeto está sob a licença MIT - sinta-se livre para usar, modificar e distribuir.