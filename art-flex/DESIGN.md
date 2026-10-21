# Direção visual — Art Flex

Modo: Persuade.

Conceito: Oficina de cadeiras, com leitura gráfica e precisão de encaixe.

Paleta: papel #f1f6f6, tinta #152d36, petroleo #146b73, gelo #d7e7e8, branco #ffffff.

Tipografia: Archivo para títulos firmes; DM Sans para informação e consulta.

Composição: Título à esquerda e cadeira em escala útil à direita. Faixa de serviços curta; coleção em três colunas no desktop amplo, duas no tablet e uma no celular, com nomes descritivos.

Primeiro viewport: Marca Art Flex, título sobre renovar cadeiras, uma foto real legível de cadeira e duas ações: ver referências ou preparar consulta. No móvel, a foto entra após o título e uma apresentação breve.

Interação própria: Uma costura vetorial pontilhada acompanha a abertura. Setas das consultas respondem ao foco, e a galeria ampliada preserva a navegação por teclado.

```text
desktop: [título/ações 42%][cadeira 58%] / [serviços] / [3col referências] / [consulta]
mobile: [marca/menu] [título/ações] [cadeira inteira] [referências] [consulta]
```

Revisão do conceito: a estrutura deriva de cadeiras, reforma ou volumes de sofás; não há métricas decorativas, etiquetas sobre títulos ou blocos de ícones repetidos. Curvas, legibilidade e fotos reais têm precedência sobre adorno.

Piso: corpo de 16px; legendas ≥ 12px; alvos ≥ 44px; formulário de 16px; foco visível; reduced-motion; colunas de medidas refluem a 320px.

QA visual centralizada pelo agente principal; este agente verifica sintaxe, caminhos, vínculos entre foto e post e textos.

## Refinamento v11

Abertura desktop com fotografia natural limitada a500px de altura pela proporção; o contêiner continua com margem de8px. No celular, título e fotografia vêm antes do texto de apoio. Corpo400, títulos450–550, nomes das peças com escala intermediária e ações de consulta distintas dos links de origem. A navegação identifica o pedido de orçamento e os serviços específicos. Nenhuma foto recebe zoom, cover ou recorte.

O tipo de pedido começa neutro. Escolher uma referência preserva nome/post, emite change no seletor e move o foco sem deslocamento adicional. Menu, filtros e galeria continuam no Atelier intacto. O módulo comum de orçamento/seleção é integrado pelo agente principal; não há outra dock local.
