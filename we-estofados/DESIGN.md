# Direção visual — WE Estofados

Modo: Persuade.

Conceito: Ateliê contemporâneo em verde profundo: fabricar e renovar no mesmo lugar.

Paleta: papel #f4f8f4, tinta #213f3b, verde #2b6256, salvia #d5e6dc, linho #e8e9db.

Tipografia: Bricolage Grotesque nos títulos; Public Sans no texto e formulário.

Composição: Abertura assimétrica com foto à direita e título que acompanha sua base. Seção de fabricação/reforma contínua; portfólio em grade com uma referência de largura dupla.

Primeiro viewport: Foto real útil de sofá completo, fabricação/reforma declaradas e botão de preparar pedido; texto não empurra a foto no celular.

Interação própria: Uma linha de costura desenhada sob o título abre uma única vez, se movimento permitido.

```text
desktop: [título/ações45%][foto55%] / [reforma|fabricação] / [destaque] [2col] / [consulta]
mobile: [título] [foto] [ações] [portfólio] [consulta]
```

Revisão do conceito: a estrutura deriva de cadeiras, reforma ou volumes de sofás; não há métricas decorativas, etiquetas sobre títulos ou blocos de ícones repetidos. Curvas, legibilidade e fotos reais têm precedência sobre adorno.

Piso: corpo de 16px; legendas ≥ 12px; alvos ≥ 44px; formulário de 16px; foco visível; reduced-motion; colunas de medidas refluem a 320px.

QA visual centralizada pelo agente principal; este agente verifica sintaxe, caminhos, vínculos entre foto e post e textos.

## Refinamento v11

Abertura desktop com fotografia natural limitada a500px de altura pela proporção; o contêiner continua com margem de8px. No celular, título e fotografia vêm antes do texto de apoio. Corpo400, títulos450–550, nomes das peças com escala intermediária e ações de consulta distintas dos links de origem. A navegação identifica o pedido de orçamento e os serviços específicos. Nenhuma foto recebe zoom, cover ou recorte.

O tipo de pedido começa neutro. Escolher uma referência preserva nome/post, emite change no seletor e move o foco sem deslocamento adicional. Menu, filtros e galeria continuam no Atelier intacto. O módulo comum de orçamento/seleção é integrado pelo agente principal; não há outra dock local.

Public Sans mantém a identidade da família. O agente principal corrige o arquivo estático Black900 incorretamente declarado como variável, substituindo-o pela fonte variável oficial para permitir corpo400.
