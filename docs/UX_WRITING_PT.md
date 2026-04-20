# Spin's Sheets — Guia de Estilo de Escrita UX

## Voz & Tom

### Voz Geral
- **Direta e prestativa** — Guie os usuarios com clareza sem ser condescendente
- **Casual mas profissional** — Tom amigavel de comunidade de RPG de mesa, nao corporativo
- **Orientada a acao** — Diga aos usuarios o que eles podem fazer, nao o que o sistema faz
- **Inclusiva** — Evite suposicoes sobre habilidade, dispositivo ou nivel de experiencia

### Tom por Contexto
| Contexto | Tom | Exemplo |
|----------|-----|---------|
| Onboarding / Tutorial | Acolhedor, encorajador | "Cada ficha e organizada em abas. Trabalhe no seu ritmo." |
| Labels de formulario | Conciso, claro | "Nome do Personagem", "Street Handle", "Cla" |
| Dicas / descricoes | Prestativo, informativo | "Busque Disciplines pelo nome — cada entrada inclui uma descricao." |
| Erros | Calmo, acionavel | "Falha ao salvar. Verifique sua conexao e tente novamente." |
| Estados vazios | Convidativo | "Nenhum personagem ainda. Crie o primeiro para comecar." |
| Confirmacoes | Claro, reversivel | "Excluir este personagem? Esta acao nao pode ser desfeita." |
| Estados de sucesso | Breve | "Salvo." / "Personagem criado." |

## Diretrizes de Escrita

### Faca
- Use linguagem simples — escreva para humanos, nao programadores
- Comece com o que o usuario pode FAZER, nao como o sistema funciona internamente
- Use caixa de sentenca para titulos e labels (nao Caixa de Titulo para tudo)
- Mantenha texto de botoes em 1-3 palavras: "Salvar", "Exportar PDF", "Novo Personagem"
- Escreva mensagens de erro que expliquem o que fazer em seguida
- Use "voce/seu" para falar diretamente com o usuario
- Traduza termos mecanicos de jogo de forma consistente (mantenha Discipline, Gift, Spell em ingles em ambos os idiomas)

### Nao Faca
- Nao use "clicar" — diga "selecionar", "escolher", "abrir", "usar" (leitores de tela, toque e teclado funcionam diferentemente)
- Nao use jargao: "endpoint", "API", "fetch", "render" em texto voltado ao usuario
- Nao use "por favor" excessivamente — maximo um "por favor" por pagina
- Nao use voz passiva para instrucoes: "O personagem foi salvo" → "Seu personagem foi salvo"
- Nao use linguagem de genero para papeis: "o Narrador" de forma neutra
- Nao assuma tamanho de tela: "o botao a direita" → "o botao Exportar PDF"

## Escrita para Acessibilidade

### Labels
- Todo input de formulario DEVE ter um label visivel ou aria-label
- Labels devem descrever o que inserir, nao como: "Nome do Personagem" nao "Digite o nome do seu personagem aqui"
- Agrupe campos relacionados com fieldset/legend
- Nao dependa de texto placeholder como unico label

### Mensagens de Erro
- Declare o que deu errado: "Falha ao carregar personagens"
- Declare o que fazer: "Verifique sua conexao e tente novamente"
- Use role="alert" para que leitores de tela anunciem erros imediatamente

### Estados Vazios
- Explique para que serve esta area
- Diga ao usuario como popula-la
- Exemplo: "Nenhum personagem ainda. Selecione 'Novo Personagem' para criar o primeiro."

### Botoes & Acoes
- Texto de botao acessivel descreve a acao: "Exportar PDF" nao apenas "Exportar"
- Acoes destrutivas usam confirmacao: "Excluir [Nome do Personagem]? Esta acao nao pode ser desfeita."
- Botoes desabilitados devem explicar o motivo (via tooltip ou texto adjacente)

## Convencoes de Traducao

### Estrutura
- Todas as strings voltadas ao usuario passam pela funcao `t()` de `useLanguage()`
- Chaves de traducao usam camelCase: `newCharBtn`, `failedToSave`, `cpWoundTrack`
- Chaves prefixadas por sistema: `cp*` (Cyberpunk), `blades*` (Blades), `dnd*` (D&D)
- Chaves de aba: `tabCpIdentity`, `tabCpStats`, etc.

### O que Traduzir
- Todos os labels de UI, titulos, legends, dicas, placeholders, mensagens de erro, texto de botoes
- Texto de tutorial e marketing na pagina inicial
- Mensagens de estados vazios
- Dialogos de confirmacao

### O que NAO Traduzir
- Substantivos proprios mecanicos de jogo: Discipline, Gift, Rote, Arcanoi, Edge, Lore, Art, Realm
- Nomes de atributos de personagem que sao termos de jogo: Strength, Dexterity, Rage, Gnosis, Arete
- Nomes proprios de entidades de jogo: "Brujah", "Ventrue", "Silver Fangs", "Virtual Adepts"
- Nomes de sistemas: "World of Darkness", "Blades in the Dark", "Cyberpunk 2020"
- Termos de codigo/tecnicos em documentacao de desenvolvedor

### Convencoes do Portugues
- Use a forma "voce" (portugues brasileiro informal)
- "Storyteller" → "Narrador"
- "Player" → "Jogador"
- "Chronicle" → "Cronica"
- "Character Sheet" → "Ficha de Personagem" ou apenas "Ficha"
- "Character" → "Personagem"
- "Save" → "Salvar"
- "Delete" → "Excluir"
- "Export" → "Exportar"
- "Search" → "Buscar"
- "New Character" → "Novo Personagem"

## Escrita Mobile

- Mantenha labels curtos — telas mobile sao estreitas
- Use o padrao de label do menu hamburger: mostre o nome do OUTRO idioma ("Mudar Idioma" quando em ingles, "Switch Language" quando em portugues) para que os usuarios reconhecam o idioma de destino
- Nomes de abas devem ter no maximo 1-2 palavras para o dropdown mobile
- Mensagens de erro devem ser legiveis sem rolagem horizontal

## Numeros & Formatacao
- Use numerais para stats de jogo: "3 pontos", "Nivel 5", "SP 14"
- Use palavras para contagens pequenas em prosa: "um personagem", "duas cronicas"
- Moeda: "500eb" (Cyberpunk), "10 Septims" (UESTRPG), "100 koku" (L5R)
- Notacao de dados: "d10", "3d6+2", "d20" (sempre 'd' minusculo)
