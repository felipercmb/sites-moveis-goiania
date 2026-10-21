# Direção visual — Play Estofados

Modo: Persuade.

Conceito: Conforto para a pausa, numa composição leve de azul mineral e lilás.

Paleta: papel #f2f7f7, tinta #283f48, mineral #3c6473, lilas #deddec, branco #ffffff.

Tipografia: Urbanist para títulos leves; Public Sans no texto e consulta.

Composição: Título curto à esquerda e sofá completo à direita, com bicama em madeira como outra referência de uso; coleção de sofás em duplas e lista simples de serviços.

Primeiro viewport: Sofá completo em evidência, ação para ver trabalhos e identidade/Negrão de Lima legível. No celular, uma foto por vez, sem colagem.

Interação própria: Botões circulares da galeria e foco conduzem a ideia de pausa/continuação, sem vídeo falso nem autoplay.

```text
desktop: [título/ações 40%][sofá inteiro 60%] / [sofás|poltronas] / [serviços] / [consulta]
mobile: [marca/menu] [título] [sofá] [ações] [galeria] [consulta]
```

Revisão do conceito: a estrutura deriva de cadeiras, reforma ou volumes de sofás; não há métricas decorativas, etiquetas sobre títulos ou blocos de ícones repetidos. Curvas, legibilidade e fotos reais têm precedência sobre adorno.

Piso: corpo de 16px; legendas ≥ 12px; alvos ≥ 44px; formulário de 16px; foco visível; reduced-motion; colunas de medidas refluem a 320px.

QA visual centralizada pelo agente principal; este agente verifica sintaxe, caminhos, vínculos entre foto e post e textos.

## Refinamento v11

Abertura desktop com fotografia natural limitada a500px de altura pela proporção; o contêiner continua com margem de8px. No celular, título e fotografia vêm antes do texto de apoio. Corpo400, títulos450–550, nomes das peças com escala intermediária e ações de consulta distintas dos links de origem. A navegação identifica o pedido de orçamento e os serviços específicos. Nenhuma foto recebe zoom, cover ou recorte.

O tipo de pedido começa neutro. Escolher uma referência preserva nome/post, emite change no seletor e move o foco sem deslocamento adicional. Menu, filtros e galeria continuam no Atelier intacto. O módulo comum de orçamento/seleção é integrado pelo agente principal; não há outra dock local.

Public Sans mantém a identidade da família. O agente principal corrige o arquivo estático Black900 incorretamente declarado como variável, substituindo-o pela fonte variável oficial para permitir corpo400.
