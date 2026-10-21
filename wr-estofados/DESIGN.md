# Direção visual — WR Estofados e Cia

Modo: Persuade.

Conceito: Mostruário de volumes confortáveis sobre grafite e névoa.

Paleta: papel #f1f0ed, tinta #262c30, grafite #303b43, nevoa #d9e0e3, lilas #c6b8d6.

Tipografia: Archivo para títulos compactos e marca; Public Sans para narrativa curta.

Composição: Primeira dobra escura com foto clara ampla; coleção clara em pares foto+texto, consulta em painel claro orgânico.

Primeiro viewport: Nome, proposta de sofás e reformas comprovadas, foto inteira com margem e CTA. Contraste forte no cabeçalho e nos controles.

Interação própria: Ações claras ganham contraste no foco; setas acompanham a consulta, sem efeitos contínuos ou filtros sobre as fotos.

```text
desktop: [marca/nav] [título curto] [fotolarga/açõeslateral] / [2colmostruário] / [consulta]
mobile: [marca/menu] [título] [fotointeira] [ações] [coleção] [consulta]
```

Revisão do conceito: a estrutura deriva de cadeiras, reforma ou volumes de sofás; não há métricas decorativas, etiquetas sobre títulos ou blocos de ícones repetidos. Curvas, legibilidade e fotos reais têm precedência sobre adorno.

Piso: corpo de 16px; legendas ≥ 12px; alvos ≥ 44px; formulário de 16px; foco visível; reduced-motion; colunas de medidas refluem a 320px.

QA visual centralizada pelo agente principal; este agente verifica sintaxe, caminhos, vínculos entre foto e post e textos.

## Refinamento v11

Abertura desktop com fotografia natural limitada a500px de altura pela proporção; o contêiner continua com margem de8px. No celular, título e fotografia vêm antes do texto de apoio. Corpo400, títulos450–550, nomes das peças com escala intermediária e ações de consulta distintas dos links de origem. A navegação identifica o pedido de orçamento e os serviços específicos. Nenhuma foto recebe zoom, cover ou recorte.

O tipo de pedido começa neutro. Escolher uma referência preserva nome/post, emite change no seletor e move o foco sem deslocamento adicional. Menu, filtros e galeria continuam no Atelier intacto. O módulo comum de orçamento/seleção é integrado pelo agente principal; não há outra dock local.

Public Sans mantém a identidade da família. O agente principal corrige o arquivo estático Black900 incorretamente declarado como variável, substituindo-o pela fonte variável oficial para permitir corpo400.
