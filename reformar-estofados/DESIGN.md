# Direção visual — Reformar Móveis Estofados

Modo: Persuade.

Conceito: Ateliê de renovação: mostrar o estofado como peça que pode continuar na casa.

Paleta: papel #f8f1f5, tinta #3b2838, ameixa #6b385c, rosa #ead4df, branco #fffdfd.

Tipografia: Bricolage Grotesque para títulos com curvas; DM Sans para texto.

Composição: Abertura editorial compacta com título e sofá completo lado a lado no desktop. Coleção alternada em linhas de imagem e texto; serviços de reforma e fabricação em bloco contínuo.

Primeiro viewport: Título curto sobre reformar ou encomendar, foto real de sofá completo e ação para consultar; município de Aparecida explícito.

Interação própria: A linha de consulta da referência se expande no foco/hover; sem movimento ou zoom na fotografia.

```text
desktop: [título/ações 47%][sofá inteiro 53%] / [foto|texto] [texto|foto] / [consulta]
mobile: [título] [sofá inteiro] [ações] [linhas de referências] [consulta]
```

Revisão do conceito: a estrutura deriva de cadeiras, reforma ou volumes de sofás; não há métricas decorativas, etiquetas sobre títulos ou blocos de ícones repetidos. Curvas, legibilidade e fotos reais têm precedência sobre adorno.

Piso: corpo de 16px; legendas ≥ 12px; alvos ≥ 44px; formulário de 16px; foco visível; reduced-motion; colunas de medidas refluem a 320px.

QA visual centralizada pelo agente principal; este agente verifica sintaxe, caminhos, vínculos entre foto e post e textos.

## Refinamento v11

Abertura desktop com fotografia natural limitada a500px de altura pela proporção; o contêiner continua com margem de8px. No celular, título e fotografia vêm antes do texto de apoio. Corpo400, títulos450–550, nomes das peças com escala intermediária e ações de consulta distintas dos links de origem. A navegação identifica o pedido de orçamento e os serviços específicos. Nenhuma foto recebe zoom, cover ou recorte.

O tipo de pedido começa neutro. Escolher uma referência preserva nome/post, emite change no seletor e move o foco sem deslocamento adicional. Menu, filtros e galeria continuam no Atelier intacto. O módulo comum de orçamento/seleção é integrado pelo agente principal; não há outra dock local.
